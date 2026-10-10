-- ==============================================================================
-- Migration: 20261010000002_row_level_security.sql
-- Description: Complete Row Level Security policies for multi-tenancy & privacy
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_program_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Security Definer Helper: User's Active Clinic IDs & Roles
CREATE OR REPLACE FUNCTION current_user_clinics()
RETURNS TABLE (clinic_id UUID, role membership_role) AS $$
BEGIN
    RETURN QUERY
    SELECT cm.clinic_id, cm.role
    FROM clinic_memberships cm
    WHERE cm.user_id = auth.uid() AND cm.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Security Definer Helper: Caregiver Check for a Specific Child
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

-- 1. CLINICS
CREATE POLICY "Clinic staff view own clinic"
ON clinics FOR SELECT
USING (id IN (SELECT clinic_id FROM current_user_clinics()));

CREATE POLICY "Clinic owners update own clinic"
ON clinics FOR UPDATE
USING (id IN (SELECT clinic_id FROM current_user_clinics() WHERE role = 'clinic_owner'));

-- 2. USER PROFILES
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Colleagues in same clinic can view profiles"
ON user_profiles FOR SELECT
USING (
    id IN (
        SELECT cm2.user_id 
        FROM clinic_memberships cm1
        JOIN clinic_memberships cm2 ON cm1.clinic_id = cm2.clinic_id
        WHERE cm1.user_id = auth.uid() AND cm1.status = 'active'
    )
);

CREATE POLICY "Users update own profile"
ON user_profiles FOR UPDATE
USING (id = auth.uid());

-- 3. CLINIC MEMBERSHIPS
CREATE POLICY "Members view colleagues in their clinic"
ON clinic_memberships FOR SELECT
USING (clinic_id IN (SELECT clinic_id FROM current_user_clinics()));

CREATE POLICY "Clinic owners manage memberships"
ON clinic_memberships FOR ALL
USING (clinic_id IN (SELECT clinic_id FROM current_user_clinics() WHERE role = 'clinic_owner'));

-- 4. CHILDREN
CREATE POLICY "Clinic staff view children in own clinic"
ON children FOR SELECT
USING (
    clinic_id IN (SELECT clinic_id FROM current_user_clinics())
    OR is_caregiver_for_child(id)
);

CREATE POLICY "Clinic staff create children in own clinic"
ON children FOR INSERT
WITH CHECK (clinic_id IN (SELECT clinic_id FROM current_user_clinics()));

CREATE POLICY "Therapists and Owners update children in own clinic"
ON children FOR UPDATE
USING (clinic_id IN (SELECT clinic_id FROM current_user_clinics() WHERE role IN ('clinic_owner', 'occupational_therapist')));

-- 5. CAREGIVERS & CHILD_CAREGIVERS
CREATE POLICY "Staff view caregivers in own clinic"
ON caregivers FOR SELECT
USING (
    user_id = auth.uid()
    OR id IN (
        SELECT cc.caregiver_id FROM child_caregivers cc
        JOIN children ch ON cc.child_id = ch.id
        WHERE ch.clinic_id IN (SELECT clinic_id FROM current_user_clinics())
    )
);

CREATE POLICY "Staff manage child_caregivers in own clinic"
ON child_caregivers FOR ALL
USING (
    child_id IN (
        SELECT id FROM children WHERE clinic_id IN (SELECT clinic_id FROM current_user_clinics())
    )
);

CREATE POLICY "Caregivers view own link"
ON child_caregivers FOR SELECT
USING (
    caregiver_id IN (SELECT id FROM caregivers WHERE user_id = auth.uid())
);

-- 6. CONSENT RECORDS
CREATE POLICY "Staff view consent records in own clinic"
ON consent_records FOR SELECT
USING (
    child_id IN (SELECT id FROM children WHERE clinic_id IN (SELECT clinic_id FROM current_user_clinics()))
    OR caregiver_id IN (SELECT id FROM caregivers WHERE user_id = auth.uid())
);

CREATE POLICY "Staff or caregiver create consent record"
ON consent_records FOR INSERT
WITH CHECK (
    child_id IN (SELECT id FROM children WHERE clinic_id IN (SELECT clinic_id FROM current_user_clinics()))
    OR caregiver_id IN (SELECT id FROM caregivers WHERE user_id = auth.uid())
);

-- 7. ASSESSMENTS & RESPONSES
CREATE POLICY "Staff view assessments in own clinic"
ON assessments FOR SELECT
USING (clinic_id IN (SELECT clinic_id FROM current_user_clinics()));

CREATE POLICY "Therapists create and update assessments"
ON assessments FOR ALL
USING (
    clinic_id IN (SELECT clinic_id FROM current_user_clinics() WHERE role IN ('clinic_owner', 'occupational_therapist'))
);

CREATE POLICY "Staff view and edit responses in own clinic"
ON assessment_responses FOR ALL
USING (
    assessment_id IN (
        SELECT id FROM assessments WHERE clinic_id IN (SELECT clinic_id FROM current_user_clinics())
    )
);

-- 8. GOALS & OBSERVATIONS
CREATE POLICY "Staff view goals in own clinic; Caregivers view assigned child goals"
ON goals FOR SELECT
USING (
    clinic_id IN (SELECT clinic_id FROM current_user_clinics())
    OR is_caregiver_for_child(child_id)
);

CREATE POLICY "Therapists manage goals"
ON goals FOR ALL
USING (
    clinic_id IN (SELECT clinic_id FROM current_user_clinics() WHERE role IN ('clinic_owner', 'occupational_therapist'))
);

CREATE POLICY "Staff view observations in own clinic"
ON goal_observations FOR SELECT
USING (
    goal_id IN (
        SELECT id FROM goals WHERE clinic_id IN (SELECT clinic_id FROM current_user_clinics())
    )
);

CREATE POLICY "Therapists insert observations"
ON goal_observations FOR INSERT
WITH CHECK (
    goal_id IN (
        SELECT id FROM goals WHERE clinic_id IN (SELECT clinic_id FROM current_user_clinics() WHERE role IN ('clinic_owner', 'occupational_therapist'))
    )
);

-- 9. SESSIONS & SESSION_GOALS
CREATE POLICY "Staff view and manage sessions in own clinic"
ON sessions FOR ALL
USING (
    clinic_id IN (SELECT clinic_id FROM current_user_clinics() WHERE role IN ('clinic_owner', 'occupational_therapist'))
);

CREATE POLICY "Staff manage session goals"
ON session_goals FOR ALL
USING (
    session_id IN (
        SELECT id FROM sessions WHERE clinic_id IN (SELECT clinic_id FROM current_user_clinics())
    )
);

-- 10. ACTIVITIES & MEDIA
CREATE POLICY "Anyone authenticated can view global and clinic activities"
ON activities FOR SELECT
USING (
    clinic_id IS NULL 
    OR clinic_id IN (SELECT clinic_id FROM current_user_clinics())
    OR status = 'published'
);

CREATE POLICY "Therapists manage clinic activities"
ON activities FOR ALL
USING (
    clinic_id IN (SELECT clinic_id FROM current_user_clinics() WHERE role IN ('clinic_owner', 'occupational_therapist'))
);

CREATE POLICY "View activity media"
ON activity_media FOR SELECT
USING (true);

-- 11. HOME PROGRAMS & ITEMS
CREATE POLICY "Staff view clinic programs; Caregivers view published child programs"
ON home_programs FOR SELECT
USING (
    clinic_id IN (SELECT clinic_id FROM current_user_clinics())
    OR (
        is_caregiver_for_child(child_id)
        AND status = 'published'
    )
);

CREATE POLICY "Therapists manage home programs"
ON home_programs FOR ALL
USING (
    clinic_id IN (SELECT clinic_id FROM current_user_clinics() WHERE role IN ('clinic_owner', 'occupational_therapist'))
);

CREATE POLICY "Staff view items; Caregivers view published items"
ON home_program_items FOR SELECT
USING (
    home_program_id IN (
        SELECT id FROM home_programs 
        WHERE clinic_id IN (SELECT clinic_id FROM current_user_clinics())
           OR (is_caregiver_for_child(child_id) AND status = 'published')
    )
);

CREATE POLICY "Therapists manage program items"
ON home_program_items FOR ALL
USING (
    home_program_id IN (
        SELECT id FROM home_programs 
        WHERE clinic_id IN (SELECT clinic_id FROM current_user_clinics() WHERE role IN ('clinic_owner', 'occupational_therapist'))
    )
);

-- 12. ACTIVITY COMPLETIONS
CREATE POLICY "Staff view completions in clinic; Caregivers view own submissions"
ON activity_completions FOR SELECT
USING (
    home_program_item_id IN (
        SELECT hpi.id FROM home_program_items hpi
        JOIN home_programs hp ON hpi.home_program_id = hp.id
        WHERE hp.clinic_id IN (SELECT clinic_id FROM current_user_clinics())
    )
    OR caregiver_id IN (
        SELECT id FROM caregivers WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Caregivers insert completions for assigned items"
ON activity_completions FOR INSERT
WITH CHECK (
    caregiver_id IN (SELECT id FROM caregivers WHERE user_id = auth.uid())
);

-- 13. REPORTS
CREATE POLICY "Staff view clinic reports; Caregivers view parent-accessible reports"
ON reports FOR SELECT
USING (
    clinic_id IN (SELECT clinic_id FROM current_user_clinics())
    OR (
        parent_accessible = true 
        AND is_caregiver_for_child(child_id)
    )
);

CREATE POLICY "Therapists manage reports"
ON reports FOR ALL
USING (
    clinic_id IN (SELECT clinic_id FROM current_user_clinics() WHERE role IN ('clinic_owner', 'occupational_therapist'))
);

-- 14. AUDIT EVENTS
CREATE POLICY "Clinic owners view clinic audit logs"
ON audit_events FOR SELECT
USING (
    clinic_id IN (SELECT clinic_id FROM current_user_clinics() WHERE role = 'clinic_owner')
);

CREATE POLICY "System inserts audit events"
ON audit_events FOR INSERT
WITH CHECK (true);
