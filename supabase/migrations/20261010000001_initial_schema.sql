-- ==============================================================================
-- Migration: 20261010000001_initial_schema.sql
-- Description: Core tables, enums, constraints, and audit triggers for Zeta Heal
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUMS
CREATE TYPE membership_role AS ENUM ('clinic_owner', 'occupational_therapist', 'clinic_admin');
CREATE TYPE membership_status AS ENUM ('invited', 'active', 'deactivated');
CREATE TYPE record_status AS ENUM ('active', 'inactive', 'archived');
CREATE TYPE caregiver_relationship AS ENUM ('mother', 'father', 'grandparent', 'guardian', 'other');
CREATE TYPE link_status AS ENUM ('invited', 'active', 'revoked');
CREATE TYPE consent_status AS ENUM ('granted', 'withdrawn', 'expired');
CREATE TYPE assessment_status AS ENUM ('draft', 'in_progress', 'finalized', 'amended');
CREATE TYPE goal_domain AS ENUM (
    'fine_motor', 
    'visual_motor', 
    'handwriting', 
    'self_care', 
    'feeding', 
    'play_participation', 
    'sensory_processing', 
    'functional_independence', 
    'other'
);
CREATE TYPE goal_status AS ENUM ('draft', 'active', 'paused', 'achieved', 'discontinued');
CREATE TYPE observation_source AS ENUM ('therapist_in_clinic', 'caregiver_home_log', 'standardized_retest');
CREATE TYPE session_status AS ENUM ('draft', 'completed', 'cancelled');
CREATE TYPE activity_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE program_status AS ENUM ('draft', 'published', 'paused', 'completed', 'archived');
CREATE TYPE completion_status AS ENUM ('completed', 'partially_completed', 'not_completed');
CREATE TYPE report_type AS ENUM (
    'initial_assessment', 
    'goal_progress', 
    'home_adherence', 
    'periodic_clinical_review', 
    'parent_friendly_summary'
);

-- 1. CLINICS
CREATE TABLE clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(63) UNIQUE,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    address JSONB,
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    default_language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PROFILES
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY, -- Maps to auth.users.id
    display_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    avatar_url TEXT,
    language_preference VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CLINIC MEMBERSHIPS
CREATE TABLE clinic_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    role membership_role NOT NULL DEFAULT 'occupational_therapist',
    status membership_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (clinic_id, user_id)
);
CREATE INDEX idx_memberships_user ON clinic_memberships(user_id);
CREATE INDEX idx_memberships_clinic ON clinic_memberships(clinic_id);

-- 4. CHILDREN (Patients)
CREATE TABLE children (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(30),
    clinical_history TEXT,
    functional_concerns TEXT NOT NULL,
    background_information TEXT,
    assigned_therapist_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    status record_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_children_clinic ON children(clinic_id);

-- 5. CAREGIVERS
CREATE TABLE caregivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    preferred_contact_method VARCHAR(20) DEFAULT 'email',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_caregivers_user ON caregivers(user_id);

-- 6. CHILD CAREGIVERS
CREATE TABLE child_caregivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    caregiver_id UUID NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
    relationship caregiver_relationship NOT NULL,
    invite_token VARCHAR(128) UNIQUE,
    invite_expires_at TIMESTAMPTZ,
    status link_status NOT NULL DEFAULT 'invited',
    can_view_progress BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (child_id, caregiver_id)
);
CREATE INDEX idx_child_caregivers_child ON child_caregivers(child_id);
CREATE INDEX idx_child_caregivers_caregiver ON child_caregivers(caregiver_id);

-- 7. CONSENT RECORDS
CREATE TABLE consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    caregiver_id UUID NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
    purpose VARCHAR(255) NOT NULL,
    status consent_status NOT NULL DEFAULT 'granted',
    version VARCHAR(20) NOT NULL DEFAULT '1.0',
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    withdrawn_at TIMESTAMPTZ
);
CREATE INDEX idx_consent_child ON consent_records(child_id);

-- 8. ASSESSMENT TEMPLATES
CREATE TABLE assessment_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE, -- NULL for platform global templates
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assessment_template_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES assessment_templates(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    form_schema JSONB NOT NULL,
    scoring_rules JSONB,
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(template_id, version_number)
);

-- 9. ASSESSMENTS
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES user_profiles(id),
    template_version_id UUID NOT NULL REFERENCES assessment_template_versions(id),
    status assessment_status NOT NULL DEFAULT 'draft',
    assessment_date DATE NOT NULL,
    clinical_interpretation TEXT,
    next_review_date DATE,
    finalized_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_assessments_child ON assessments(child_id);

CREATE TABLE assessment_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    field_id VARCHAR(100) NOT NULL,
    field_label TEXT NOT NULL,
    response_value JSONB NOT NULL,
    score NUMERIC,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assessment_id, field_id)
);

-- 10. GOALS
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    responsible_therapist_id UUID NOT NULL REFERENCES user_profiles(id),
    domain goal_domain NOT NULL,
    title VARCHAR(255) NOT NULL,
    functional_description TEXT NOT NULL,
    baseline_value TEXT NOT NULL,
    baseline_numeric NUMERIC,
    target_value TEXT NOT NULL,
    target_numeric NUMERIC,
    measurement_unit VARCHAR(50),
    status goal_status NOT NULL DEFAULT 'draft',
    start_date DATE NOT NULL,
    target_review_date DATE,
    achieved_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_goals_child ON goals(child_id);

CREATE TABLE goal_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    recorded_by UUID NOT NULL REFERENCES user_profiles(id),
    observation_date DATE NOT NULL,
    source observation_source NOT NULL DEFAULT 'therapist_in_clinic',
    measured_numeric NUMERIC,
    measured_qualitative TEXT,
    clinical_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_goal_obs_goal ON goal_observations(goal_id);

-- 11. SESSIONS
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES user_profiles(id),
    session_date DATE NOT NULL,
    duration_minutes INT DEFAULT 45,
    status session_status NOT NULL DEFAULT 'draft',
    objective_observations TEXT,
    assistance_level VARCHAR(100),
    intervention_response TEXT,
    plan_for_next_session TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_sessions_child ON sessions(child_id);

CREATE TABLE session_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    progress_notes TEXT,
    assistance_given VARCHAR(100),
    UNIQUE (session_id, goal_id)
);

-- 12. ACTIVITIES
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE, -- NULL for global catalog
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT NOT NULL,
    functional_purpose TEXT NOT NULL,
    materials_needed TEXT,
    estimated_duration_minutes INT DEFAULT 15,
    suggested_frequency VARCHAR(100) DEFAULT '3 times per week',
    difficulty_level VARCHAR(50) DEFAULT 'moderate',
    safety_guidance TEXT,
    supervision_guidance TEXT,
    status activity_status NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_activities_clinic ON activities(clinic_id);

CREATE TABLE activity_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type VARCHAR(50) NOT NULL,
    caption TEXT,
    display_order INT DEFAULT 0
);

-- 13. HOME PROGRAMS
CREATE TABLE home_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES user_profiles(id),
    title VARCHAR(255) NOT NULL,
    notes_for_caregiver TEXT,
    status program_status NOT NULL DEFAULT 'draft',
    start_date DATE NOT NULL,
    end_date DATE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_home_programs_child ON home_programs(child_id);

CREATE TABLE home_program_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_program_id UUID NOT NULL REFERENCES home_programs(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
    linked_goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
    snapshot_title VARCHAR(255) NOT NULL,
    snapshot_instructions TEXT NOT NULL,
    snapshot_materials TEXT,
    prescribed_frequency VARCHAR(100) NOT NULL,
    prescribed_duration_minutes INT NOT NULL,
    special_caregiver_notes TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_hp_items_program ON home_program_items(home_program_id);

-- 14. ACTIVITY COMPLETIONS
CREATE TABLE activity_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_program_item_id UUID NOT NULL REFERENCES home_program_items(id) ON DELETE CASCADE,
    caregiver_id UUID NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL,
    status completion_status NOT NULL,
    difficulty_experienced VARCHAR(50),
    child_engagement VARCHAR(50),
    assistance_needed VARCHAR(50),
    caregiver_observations TEXT,
    reason_not_completed TEXT,
    idempotency_key VARCHAR(128) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_completions_item ON activity_completions(home_program_item_id);

-- 15. REPORTS
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES user_profiles(id),
    title VARCHAR(255) NOT NULL,
    report_type report_type NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    clinical_narrative TEXT,
    parent_accessible BOOLEAN DEFAULT FALSE,
    pdf_storage_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_reports_child ON reports(child_id);

-- 16. NOTIFICATIONS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    metadata JSONB,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notif_recipient ON notifications(recipient_user_id);

-- 17. AUDIT EVENTS
CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_audit_clinic ON audit_events(clinic_id);

-- AUTO-UPDATE TIMESTAMPS TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clinics_modtime BEFORE UPDATE ON clinics FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER update_children_modtime BEFORE UPDATE ON children FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER update_goals_modtime BEFORE UPDATE ON goals FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER update_sessions_modtime BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER update_home_programs_modtime BEFORE UPDATE ON home_programs FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
