// ==============================================================================
// Zeta Heal (OT Pathway) - Shared Domain TypeScript Types
// ==============================================================================

export type UUID = string;

// Roles & Membership
export type MembershipRole = 'clinic_owner' | 'occupational_therapist' | 'clinic_admin';
export type MembershipStatus = 'invited' | 'active' | 'deactivated';

export interface Clinic {
  id: UUID;
  name: string;
  subdomain?: string;
  contact_email: string;
  contact_phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  timezone: string;
  default_language: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: UUID;
  display_name: string;
  email: string;
  phone_number?: string;
  avatar_url?: string;
  language_preference: string;
  created_at: string;
  updated_at: string;
}

export interface ClinicMembership {
  id: UUID;
  clinic_id: UUID;
  user_id: UUID;
  role: MembershipRole;
  status: MembershipStatus;
  created_at: string;
  updated_at: string;
  // Joined fields
  user_profile?: UserProfile;
  clinic?: Clinic;
}

// Child & Caregiver
export type RecordStatus = 'active' | 'inactive' | 'archived';
export type CaregiverRelationship = 'mother' | 'father' | 'grandparent' | 'guardian' | 'other';
export type LinkStatus = 'invited' | 'active' | 'revoked';
export type ConsentStatus = 'granted' | 'withdrawn' | 'expired';

export interface Child {
  id: UUID;
  clinic_id: UUID;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender?: string;
  clinical_history?: string;
  functional_concerns?: string;
  background_information?: string;
  assigned_therapist_id?: UUID;
  status: RecordStatus;
  created_at: string;
  updated_at: string;
  // Relational joins
  assigned_therapist?: UserProfile;
}

export interface Caregiver {
  id: UUID;
  user_id?: UUID;
  email: string;
  phone_number?: string;
  preferred_contact_method: 'email' | 'sms' | 'phone';
  created_at: string;
  updated_at: string;
  user_profile?: UserProfile;
}

export interface ChildCaregiver {
  id: UUID;
  child_id: UUID;
  caregiver_id: UUID;
  relationship: CaregiverRelationship;
  invite_token?: string;
  invite_expires_at?: string;
  status: LinkStatus;
  can_view_progress: boolean;
  created_at: string;
  updated_at: string;
  caregiver?: Caregiver;
}

export interface ConsentRecord {
  id: UUID;
  child_id: UUID;
  caregiver_id: UUID;
  purpose: string;
  status: ConsentStatus;
  version: string;
  recorded_at: string;
  withdrawn_at?: string;
}

// Assessments
export type AssessmentStatus = 'draft' | 'in_progress' | 'finalized' | 'amended';
export type AssessmentFieldType = 
  | 'short_text' 
  | 'long_text' 
  | 'number' 
  | 'date' 
  | 'single_choice' 
  | 'multiple_choice' 
  | 'boolean' 
  | 'repeating_observations';

export interface AssessmentFieldDefinition {
  id: string;
  label: string;
  field_type: AssessmentFieldType;
  required: boolean;
  options?: string[];
  unit?: string;
  min?: number;
  max?: number;
  help_text?: string;
}

export interface AssessmentTemplateVersion {
  id: UUID;
  template_id: UUID;
  version_number: number;
  form_schema: {
    fields: AssessmentFieldDefinition[];
  };
  scoring_rules?: Record<string, unknown>;
  instructions?: string;
  created_at: string;
}

export interface AssessmentTemplate {
  id: UUID;
  clinic_id?: UUID;
  title: string;
  description?: string;
  category: string;
  is_active: boolean;
  created_at: string;
  current_version?: AssessmentTemplateVersion;
}

export interface AssessmentResponse {
  id: UUID;
  assessment_id: UUID;
  field_id: string;
  field_label: string;
  response_value: unknown;
  score?: number;
  notes?: string;
  created_at: string;
}

export interface Assessment {
  id: UUID;
  clinic_id: UUID;
  child_id: UUID;
  therapist_id: UUID;
  template_version_id: UUID;
  status: AssessmentStatus;
  assessment_date: string;
  clinical_interpretation?: string;
  next_review_date?: string;
  finalized_at?: string;
  created_at: string;
  updated_at: string;
  therapist?: UserProfile;
  template_version?: AssessmentTemplateVersion;
  responses?: AssessmentResponse[];
}

// Functional Goals
export type GoalDomain = 
  | 'fine_motor'
  | 'visual_motor'
  | 'handwriting'
  | 'self_care'
  | 'feeding'
  | 'play_participation'
  | 'sensory_processing'
  | 'functional_independence'
  | 'other';

export type GoalStatus = 'draft' | 'active' | 'paused' | 'achieved' | 'discontinued';
export type ObservationSource = 'therapist_in_clinic' | 'caregiver_home_log' | 'standardized_retest';

export interface Goal {
  id: UUID;
  clinic_id: UUID;
  child_id: UUID;
  responsible_therapist_id: UUID;
  domain: GoalDomain;
  title: string;
  functional_description: string;
  baseline_value: string;
  baseline_numeric?: number;
  target_value: string;
  target_numeric?: number;
  measurement_unit?: string;
  status: GoalStatus;
  start_date: string;
  target_review_date?: string;
  achieved_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  responsible_therapist?: UserProfile;
  observations?: GoalObservation[];
}

export interface GoalObservation {
  id: UUID;
  goal_id: UUID;
  recorded_by: UUID;
  observation_date: string;
  source: ObservationSource;
  measured_numeric?: number;
  measured_qualitative?: string;
  clinical_notes?: string;
  created_at: string;
  recorder?: UserProfile;
}

// Clinical Sessions
export type SessionStatus = 'draft' | 'completed' | 'cancelled';

export interface Session {
  id: UUID;
  clinic_id: UUID;
  child_id: UUID;
  therapist_id: UUID;
  session_date: string;
  duration_minutes: number;
  status: SessionStatus;
  objective_observations?: string;
  assistance_level?: string;
  intervention_response?: string;
  plan_for_next_session?: string;
  created_at: string;
  updated_at: string;
  therapist?: UserProfile;
  session_goals?: SessionGoal[];
}

export interface SessionGoal {
  id: UUID;
  session_id: UUID;
  goal_id: UUID;
  progress_notes?: string;
  assistance_given?: string;
  goal?: Goal;
}

// Activities & Library
export type ActivityStatus = 'draft' | 'published' | 'archived';

export interface Activity {
  id: UUID;
  clinic_id?: UUID;
  title: string;
  category: string;
  description: string;
  instructions: string;
  functional_purpose: string;
  materials_needed?: string;
  estimated_duration_minutes: number;
  suggested_frequency: string;
  difficulty_level: string;
  safety_guidance?: string;
  supervision_guidance?: string;
  status: ActivityStatus;
  created_at: string;
  updated_at: string;
  media?: ActivityMedia[];
}

export interface ActivityMedia {
  id: UUID;
  activity_id: UUID;
  media_url: string;
  media_type: 'image' | 'video_link';
  caption?: string;
  display_order: number;
}

// Home Programs & Completions
export type ProgramStatus = 'draft' | 'published' | 'paused' | 'completed' | 'archived';
export type CompletionStatus = 'completed' | 'partially_completed' | 'not_completed';

export interface HomeProgram {
  id: UUID;
  clinic_id: UUID;
  child_id: UUID;
  therapist_id: UUID;
  title: string;
  notes_for_caregiver?: string;
  status: ProgramStatus;
  start_date: string;
  end_date?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  therapist?: UserProfile;
  items?: HomeProgramItem[];
}

export interface HomeProgramItem {
  id: UUID;
  home_program_id: UUID;
  activity_id?: UUID;
  linked_goal_id?: UUID;
  snapshot_title: string;
  snapshot_instructions: string;
  snapshot_materials?: string;
  prescribed_frequency: string;
  prescribed_duration_minutes: number;
  special_caregiver_notes?: string;
  display_order: number;
  created_at: string;
  activity?: Activity;
  linked_goal?: Goal;
  completions?: ActivityCompletion[];
}

export interface ActivityCompletion {
  id: UUID;
  home_program_item_id: UUID;
  caregiver_id: UUID;
  completion_date: string;
  status: CompletionStatus;
  difficulty_experienced?: 'too_easy' | 'just_right' | 'challenging' | 'frustrating';
  child_engagement?: 'enthusiastic' | 'cooperative' | 'reluctant' | 'refused';
  assistance_needed?: 'independent' | 'minimal_help' | 'full_assistance';
  caregiver_observations?: string;
  reason_not_completed?: string;
  idempotency_key?: string;
  created_at: string;
  caregiver?: Caregiver;
}

// Reports
export type ReportType = 
  | 'initial_assessment' 
  | 'goal_progress' 
  | 'home_adherence' 
  | 'periodic_clinical_review' 
  | 'parent_friendly_summary';

export interface Report {
  id: UUID;
  clinic_id: UUID;
  child_id: UUID;
  author_id: UUID;
  title: string;
  report_type: ReportType;
  period_start: string;
  period_end: string;
  clinical_narrative?: string;
  parent_accessible: boolean;
  pdf_storage_path?: string;
  created_at: string;
  author?: UserProfile;
  child?: Child;
}

// Notifications & Auditing
export interface Notification {
  id: UUID;
  recipient_user_id: UUID;
  title: string;
  body: string;
  category: string;
  metadata?: Record<string, unknown>;
  read_at?: string;
  created_at: string;
}

export interface AuditEvent {
  id: UUID;
  clinic_id?: UUID;
  actor_id?: UUID;
  actor_role: string;
  action: string;
  entity_type: string;
  entity_id: UUID;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Dashboard Summary DTO
export interface ClinicDashboardSummary {
  active_children_count: number;
  active_home_programs_count: number;
  upcoming_reviews_count: number;
  recent_submissions_count: number;
  goals_due_for_review_count: number;
}
