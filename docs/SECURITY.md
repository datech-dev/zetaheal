# Zeta Heal (OT Pathway) - Security & Privacy Specification

## 1. Multi-Tenant Row Level Security (RLS) Matrix

Every query and mutation touching child records, assessments, goals, or home programs must pass through PostgreSQL Row Level Security. The Supabase service-role key is **never** bundled or exposed in web or mobile client builds.

### 1.1 Tenant Isolation Invariant
$$ \text{Clinic}_A \cap \text{Clinic}_B = \emptyset $$
A user authenticated with a session linked to Clinic A cannot execute `SELECT`, `INSERT`, `UPDATE`, or `DELETE` against any record belonging to Clinic B.

### 1.2 Access Matrix
| Table | Clinic Owner | Therapist | Clinic Admin | Caregiver | Public / Anon |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `clinics` | Read/Update own | Read own | Read own | None | None |
| `clinic_memberships` | Full CRUD own | Read own clinic | Read/Invite | None | None |
| `children` | Full CRUD own | Full CRUD own | Read/Create (non-clinical) | Read assigned child only | None |
| `assessments` | Read/Sign own clinic | Full CRUD assigned | Read status only | None | None |
| `goals` | Read own clinic | Full CRUD assigned | Read status only | Read assigned child goals | None |
| `goal_observations` | Read own clinic | Full CRUD assigned | None | Read approved summaries | None |
| `sessions` | Read own clinic | Full CRUD own sessions | Read schedule only | None | None |
| `activities` | CRUD clinic library | CRUD clinic library | Read only | Read assigned activities | None |
| `home_programs` | Read own clinic | Full CRUD assigned | Read only | Read published programs for child | None |
| `home_program_items`| Read own clinic | Full CRUD assigned | Read only | Read published items | None |
| `activity_completions`| Read own clinic | Read assigned child | Read only | Insert / Read own logs | None |
| `reports` | Read/Download own | Full CRUD assigned | Read only | Read if `parent_accessible = true` | None |
| `consent_records` | Read own clinic | Read assigned | Manage records | Read/Withdraw own consent | None |
| `audit_events` | Read only (own clinic) | None | None | None | None |

---

## 2. Row Level Security Policy Definitions

### Helper Functions in PostgreSQL:
```sql
CREATE OR REPLACE FUNCTION current_user_clinics()
RETURNS TABLE (clinic_id UUID, role membership_role) AS $$
BEGIN
    RETURN QUERY
    SELECT cm.clinic_id, cm.role
    FROM clinic_memberships cm
    WHERE cm.user_id = auth.uid() AND cm.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_caregiver_for_child(p_child_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM child_caregivers cc
        JOIN caregivers c ON cc.caregiver_id = c.id
        WHERE cc.child_id = p_child_id
          AND c.user_id = auth.uid()
          AND cc.status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Policy Examples:
```sql
-- Children Isolation:
ALTER TABLE children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists and Admins view own clinic children"
ON children FOR SELECT
USING (
    clinic_id IN (SELECT clinic_id FROM current_user_clinics())
    OR is_caregiver_for_child(id)
);

CREATE POLICY "Clinic staff insert children"
ON children FOR INSERT
WITH CHECK (
    clinic_id IN (SELECT clinic_id FROM current_user_clinics())
);

-- Home Programs Isolation:
ALTER TABLE home_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff view clinic home programs"
ON home_programs FOR SELECT
USING (
    clinic_id IN (SELECT clinic_id FROM current_user_clinics())
    OR (
        is_caregiver_for_child(child_id) 
        AND status = 'published'
    )
);
```

---

## 3. Caregiver Verification & Secure Linking Protocol

Caregivers cannot link themselves to a child by guessing IDs. A 4-step cryptographically verified linking protocol is enforced:

1. **Invitation Generation**:
   - Authorized therapist or clinic admin generates a caregiver invitation for Child $C$.
   - Server generates a cryptographically secure token: `token = crypto.randomBytes(32).toString('hex')`.
   - Token is hashed with SHA-256 before storage in `child_caregivers.invite_token`.
   - Expiration timestamp set to $\text{now} + 72 \text{ hours}$.
2. **Delivery**:
   - Sent via verified email or secure SMS with a link: `https://app.zetaheal.com/invite?token=xyz` or deep link `zetaheal://invite?token=xyz`.
3. **Redemption & Account Binding**:
   - Caregiver signs in or registers on the mobile app.
   - Mobile app submits `redeemCaregiverInvite(token)`.
   - API verifies: token matches hash, hasn't expired, status is `invited`.
   - `child_caregivers.caregiver_id` bound to verified caregiver; status updated to `active`; token invalidated immediately (single-use).
   - Audit event logged: `CAREGIVER_LINKED`.
4. **Consent Precondition**:
   - Before active home programs can be served, caregiver must accept the clinic's digital care coordination consent policy (`consent_records`).

---

## 4. Privacy & Sensitive Data Handling
1. **Identifier De-identification**: 
   - No patient names, dates of birth, or diagnosis terms appear in URLs, route parameters, or analytics payloads.
   - All client routes use opaque UUIDs (e.g., `/workspace/children/7b8c.../goals`).
2. **No Clinical Notes in Push Notifications**:
   - Mobile push notifications contain only neutral, non-stigmatizing prompts:
     - *"New home activities are available for today."*
     - *"Time for today's sensory play session!"*
   - Never: *"Child has not completed therapy for Autism Spectrum Disorder."*
3. **Revocation & Right to be Forgotten**:
   - Clinic owners can immediately deactivate a caregiver link or staff member.
   - Revocation terminates active Supabase JWT sessions instantly via server-side session invalidation.

---

## 5. Security Test Matrix

An automated test suite validates the following multi-tenant permutations:
- **Clinic 1 (Lotus Pediatric Therapy)**:
  - Therapist A (`therapist_a@lotus.example`)
  - Child 1 (Aarav, age 6)
  - Caregiver 1 (Priya, mother)
- **Clinic 2 (Blossom Child Development)**:
  - Therapist B (`therapist_b@blossom.example`)
  - Child 2 (Diya, age 4)
  - Caregiver 2 (Rohan, father)
- **Unauthorized / Attacker**:
  - Malicious User (`attacker@external.example`)

### Test Assertions:
1. `Therapist A` cannot view Child 2, goals, or assessments belonging to Clinic 2.
2. `Therapist B` cannot modify home programs belonging to Child 1.
3. `Caregiver 1` attempting to query `home_programs` with `child_id = Child 2` receives an empty set or 403 Forbidden.
4. `Caregiver 1` cannot edit any clinical goal or clinical assessment.
5. `Attacker` querying `/api/children` receives 401 Unauthorized.
6. Revoked Caregiver immediately receives 403 on subsequent completion submissions.
