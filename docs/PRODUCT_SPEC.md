# Zeta Heal (OT Pathway) - Product Specification

## 1. Executive Summary & Vision
**Zeta Heal** (branded as **OT Pathway**) is an enterprise-grade, pediatric occupational therapy clinic management and care-coordination platform. 

### Core Value Proposition
> *"Help pediatric occupational therapy clinics connect every home activity to a functional goal and understand what happens between therapy sessions."*

Pediatric occupational therapy relies heavily on consistent caregiver engagement and therapeutic play at home. However, traditional clinics struggle with:
- Disconnected home practice programs (static paper sheets with low compliance).
- Difficulty tracking whether child behaviors at home align with therapy goals.
- Lack of continuous visibility between weekly or bi-weekly clinical visits.
- Siloed clinical documentation that is difficult to translate into parent-friendly progress reports.

**Zeta Heal** solves this by establishing an integrated digital loop:
1. **Therapists** assess children, establish functional goals, design customized home programs using a rich activity library, and document clinical sessions.
2. **Caregivers** receive structured, therapist-assigned activities on a dedicated mobile app, log completions with qualitative observations, and submit feedback.
3. **The Platform** correlates home compliance with clinical goal milestones, generating objective progress timelines and print-ready clinical reports.

### Clinical Boundaries & Non-Goals
- **Workflow & Documentation Only**: Zeta Heal is explicitly a clinical workflow, collaboration, and documentation tool.
- **No Autonomous Diagnosis**: The system does **not** independently diagnose children, formulate treatment plans without human direction, or invent clinical conclusions.
- **Parent Data Distinction**: The platform strictly and visually distinguishes parent-reported activity completion from therapist-recorded clinical findings and formal standardized scoring.

---

## 2. Target Users & Role-Based Access Control (RBAC)

The system enforces multi-tenant isolation and strict role-based authorization across four primary roles:

| Role | Key Capabilities | Boundary Constraints |
| :--- | :--- | :--- |
| **Clinic Owner** | Clinic workspace settings, staff invitation & role assignment, template management, clinic-wide analytics, audit logs, billing. | Bound strictly to own clinic tenant (`clinic_id`). Cannot access other clinics. |
| **Occupational Therapist** | Child records, assessment authoring & finalization, functional goal lifecycle, activity creation, home program publishing, session logs, progress reports. | Full clinical authority over assigned children; cannot access internal settings of other clinics. |
| **Clinic Administrator** | Operational onboarding, caregiver invite administration, appointment scheduling, non-clinical record management. | **Restricted Clinical Access**: Cannot view therapist-confidential session notes or alter clinical assessments without explicit role policy grant. |
| **Parent / Caregiver** | View therapist-published home programs, view media/instructions, log activity completions (Complete / Partial / Not Done), provide feedback, view approved progress summaries. | **Zero Clinical Modification**: Cannot edit goals, cannot see draft or internal notes, cannot self-link to unverified children. Verified token invite only. |

---

## 3. Core Functional Modules

### 3.1 Authentication & Multi-Tenant Onboarding
- **Supabase Auth Integration**: Email/password, magic link verification, password resets.
- **Multi-Tenant Scoping**: All clinic data is isolated by `clinic_id` using PostgreSQL Row Level Security (RLS) policies.
- **Interactive Onboarding Wizard**:
  - Step 1: Clinic details (Name, contact email, phone, address, timezone, default language).
  - Step 2: Account owner credentials.
  - Step 3: Staff invitations with role pre-assignment.
  - Step 4: Initial goal domain setup (Fine Motor, Visual-Motor, Sensory, ADL/Self-care, Gross Motor).
  - Step 5: Guided activity library tour.
  - Step 6: First patient creation walkthrough.

### 3.2 Child Record & Clinical Workspace
- **Sensitive Identity Handling**: De-identified URLs using UUIDs; child names and dates of birth are never leaked in public logs or analytics URLs.
- **Tabbed Workspace**:
  - **Overview**: Active goals, latest assessment status, active home program, recent caregiver submissions, next review date.
  - **Assessments**: Structured evaluations, versioned templates, clinical scoring, finalization lock.
  - **Goals**: Multi-domain functional goals with baselines, targets, measurement units, and review cycles.
  - **Sessions**: Subjective/Objective notes, assistance level, intervention response, next plan.
  - **Home Programs**: Published program snapshots, compliance rates, caregiver feedback.
  - **Timeline**: Unified chronological feed of all clinical & home events.
  - **Reports**: Print-ready and downloadable PDF summaries.
  - **Caregivers**: Verified links, invite tokens, consent records.

### 3.3 Extensible Assessment Builder
- **Template Versioning**: Templates support versioning so historical assessments remain immutable.
- **Field Types**: Short text, long narrative, numeric measurements, date picker, single choice, multiple choice, boolean flags, repeating observation sets.
- **Workflow State Machine**: `draft` -> `in_progress` -> `finalized` (immutable) -> `amended` (creates documented audit trail).

### 3.4 Functional Goal Management
- **Goal Domains**: Fine Motor Skills, Visual-Motor Integration, Handwriting, Self-Care / Activities of Daily Living (ADL), Feeding, Play & Participation, Sensory Processing, Functional Independence.
- **Quantitative & Qualitative**: Supports both numeric metrics (e.g., "Maintains pincer grasp for 10 seconds") and qualitative descriptive milestones (e.g., "Independently buttons a 4-button shirt").
- **Lifecycle**: `draft` -> `active` -> `paused` -> `achieved` -> `discontinued` -> `reopened`.

### 3.5 Demonstration Activity Library
- Curated library of 20+ pediatric OT activities covering diverse functional domains:
  1. Clothespin Color Match (Fine Motor / Pincer Grasp)
  2. Playdough Finger Pinch & Roll (Intrinsic Hand Strength)
  3. Lacing Bead Tower (Bilateral Coordination)
  4. Scissor Maze Trail (Visual-Motor & Cutting Skills)
  5. Animal Walk Obstacle Course (Gross Motor & Proprioceptive Input)
  6. Button Snake Practice (ADL / Fine Motor)
  7. Tweezer Pom-Pom Sort (Pincer & Visual Discrimination)
  8. Shaving Cream Pre-Writing Tracing (Tactile & Sensory Exploration)
  9. Sensory Obstacle Balance Path (Vestibular & Balance)
  10. Zipper & Snap Board (Self-Care & Fine Motor)
  11. Straw Rocket Breathing (Oral-Motor & Self-Regulation)
  12. Chopstick Sponge Transfer (Hand Dominance & Separation of Hand)
  13. Mirror Emotion Imitation (Social Participation & Motor Planning)
  14. Dot Marker Pattern Copy (Visual-Spatial & Motor Precision)
  15. Shoe Tying Step Ladder (ADL Functional Sequencing)
  16. Clay Alphabet Imprints (Handwriting Readiness)
  17. Heavy Work Laundry Basket Push (Sensory / Proprioceptive)
  18. Spoon-to-Bowl Water Transfer (Feeding & Forearm Supination)
  19. Paper Plate Ring Toss (Upper Extremity Motor Planning)
  20. Balloon Volleyball (Bimanual Coordination & Reaction Time)
- Immutable assignment snapshots: When an activity in the library is modified, historical published home programs retain their exact assigned snapshot.

### 3.6 Home Program Builder & Caregiver Mobile Experience
- **Therapist Builder**: Assign activities, tie them to specific goals, prescribe frequency (e.g., 3x/week, 10 min), include customized instructions.
- **Parent Mobile App (React Native / Expo)**:
  - Secure token sign-in and verified child linking.
  - Daily activity dashboard with clear action buttons.
  - Rich instructions, demonstration media, required materials, supervision notes.
  - One-tap completion logging: `Completed`, `Partially Completed`, `Not Completed`.
  - Non-stigmatizing feedback (optional reasons, difficulty rating, child engagement rating).
  - Localization support for English and Tamil.

### 3.7 Outcome Reports & PDF Engine
- Generates professional clinical reports:
  - Initial Assessment Summary
  - Functional Goal Progress Report
  - Home Program Adherence & Feedback Review
  - Comprehensive Periodic Review (Parent-friendly & Clinical variants)
- Clear separation between clinical observations (measured by OT) and caregiver-reported practice.
- Print-ready CSS formatting with headers, page breaks, clinic branding, and sign-off blocks.

---

## 4. Compliance, Privacy & Security
- **Data Minimization**: Collect only clinically required data. No child identifiers in open URLs or telemetry.
- **Consent Tracking**: Explicit caregiver consent records stored with version, purpose, and timestamp. Revocation immediately disables caregiver access.
- **Audit Logging**: Immutable audit table tracking logins, record creation, assessment finalization, goal state transitions, report downloads, and access revocation.
- **Row Level Security**: All database tables enforce strict tenant checks at the database layer.
