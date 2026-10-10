// ==============================================================================
// Zeta Heal (OT Pathway) - Zod Validation Schemas
// ==============================================================================

import { z } from 'zod';

// Clinic Onboarding
export const clinicOnboardingSchema = z.object({
  clinicName: z.string().min(2, 'Clinic name must be at least 2 characters').max(100),
  contactEmail: z.string().email('Please enter a valid clinic email'),
  contactPhone: z.string().min(7, 'Please enter a valid phone number').max(20),
  timezone: z.string().default('Asia/Kolkata'),
  defaultLanguage: z.enum(['en', 'ta']).default('en'),
  street: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State / Province is required'),
  postalCode: z.string().optional(),
  country: z.string().default('India'),
  ownerDisplayName: z.string().min(2, 'Your name is required').max(100),
});

export type ClinicOnboardingInput = z.infer<typeof clinicOnboardingSchema>;

// Child Profile
export const childSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(60),
  lastName: z.string().min(1, 'Last name is required').max(60),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be YYYY-MM-DD'),
  gender: z.enum(['male', 'female', 'non_binary', 'other']).optional(),
  clinicalHistory: z.string().max(2000).optional(),
  functionalConcerns: z.string().min(5, 'Please describe main functional concerns').max(2000),
  backgroundInformation: z.string().max(2000).optional(),
  assignedTherapistId: z.string().uuid().optional(),
});

export type ChildInput = z.infer<typeof childSchema>;

// Caregiver Invite
export const caregiverInviteSchema = z.object({
  email: z.string().email('Valid caregiver email is required'),
  relationship: z.enum(['mother', 'father', 'grandparent', 'guardian', 'other']),
  phoneNumber: z.string().max(20).optional(),
  canViewProgress: z.boolean().default(true),
});

export type CaregiverInviteInput = z.infer<typeof caregiverInviteSchema>;

// Assessment Form Response
export const assessmentSubmissionSchema = z.object({
  childId: z.string().uuid(),
  templateVersionId: z.string().uuid(),
  assessmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  clinicalInterpretation: z.string().optional(),
  nextReviewDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  responses: z.record(
    z.string(), // field_id
    z.object({
      fieldLabel: z.string(),
      value: z.unknown(),
      score: z.number().optional(),
      notes: z.string().optional(),
    })
  ),
});

export type AssessmentSubmissionInput = z.infer<typeof assessmentSubmissionSchema>;

// Functional Goal
export const goalSchema = z.object({
  childId: z.string().uuid(),
  domain: z.enum([
    'fine_motor',
    'visual_motor',
    'handwriting',
    'self_care',
    'feeding',
    'play_participation',
    'sensory_processing',
    'functional_independence',
    'other',
  ]),
  title: z.string().min(3, 'Goal title must be at least 3 characters').max(200),
  functionalDescription: z.string().min(10, 'Provide a meaningful functional description').max(1000),
  baselineValue: z.string().min(1, 'Baseline description is required').max(300),
  baselineNumeric: z.number().optional(),
  targetValue: z.string().min(1, 'Target description is required').max(300),
  targetNumeric: z.number().optional(),
  measurementUnit: z.string().max(30).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  targetReviewDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  notes: z.string().max(1000).optional(),
});

export type GoalInput = z.infer<typeof goalSchema>;

// Goal Observation
export const goalObservationSchema = z.object({
  goalId: z.string().uuid(),
  observationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  source: z.enum(['therapist_in_clinic', 'caregiver_home_log', 'standardized_retest']),
  measuredNumeric: z.number().optional(),
  measuredQualitative: z.string().max(500).optional(),
  clinicalNotes: z.string().max(1000).optional(),
});

export type GoalObservationInput = z.infer<typeof goalObservationSchema>;

// Session Documentation
export const sessionSchema = z.object({
  childId: z.string().uuid(),
  sessionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  durationMinutes: z.number().min(15).max(180).default(45),
  objectiveObservations: z.string().min(5, 'Objective observations are required').max(2000),
  assistanceLevel: z.string().max(100).optional(),
  interventionResponse: z.string().max(2000).optional(),
  planForNextSession: z.string().max(1000).optional(),
  goalsAddressed: z.array(
    z.object({
      goalId: z.string().uuid(),
      progressNotes: z.string().optional(),
      assistanceGiven: z.string().optional(),
    })
  ).default([]),
});

export type SessionInput = z.infer<typeof sessionSchema>;

// Activity in Library
export const activitySchema = z.object({
  title: z.string().min(3, 'Title is required').max(150),
  category: z.string().min(2, 'Category is required').max(80),
  description: z.string().min(10, 'Provide a brief summary').max(500),
  instructions: z.string().min(20, 'Provide step-by-step instructions').max(3000),
  functionalPurpose: z.string().min(10, 'Explain the functional therapy rationale').max(1000),
  materialsNeeded: z.string().max(500).optional(),
  estimatedDurationMinutes: z.number().min(5).max(60).default(15),
  suggestedFrequency: z.string().min(2).max(100).default('3 times per week'),
  difficultyLevel: z.enum(['easy', 'moderate', 'challenging']).default('moderate'),
  safetyGuidance: z.string().max(1000).optional(),
  supervisionGuidance: z.string().max(1000).optional(),
});

export type ActivityInput = z.infer<typeof activitySchema>;

// Home Program Builder
export const homeProgramItemSchema = z.object({
  activityId: z.string().uuid().optional(),
  linkedGoalId: z.string().uuid().optional(),
  snapshotTitle: z.string().min(2),
  snapshotInstructions: z.string().min(5),
  snapshotMaterials: z.string().optional(),
  prescribedFrequency: z.string().min(2),
  prescribedDurationMinutes: z.number().min(5).max(120),
  specialCaregiverNotes: z.string().max(1000).optional(),
  displayOrder: z.number().default(0),
});

export const homeProgramSchema = z.object({
  childId: z.string().uuid(),
  title: z.string().min(3, 'Program title is required').max(150),
  notesForCaregiver: z.string().max(1500).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  items: z.array(homeProgramItemSchema).min(1, 'Please add at least one activity to the program'),
});

export type HomeProgramInput = z.infer<typeof homeProgramSchema>;

// Parent Activity Completion
export const activityCompletionSchema = z.object({
  homeProgramItemId: z.string().min(1),
  completionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(['completed', 'partially_completed', 'not_completed']),
  difficultyExperienced: z.enum(['too_easy', 'just_right', 'challenging', 'frustrating']).optional(),
  childEngagement: z.enum(['enthusiastic', 'cooperative', 'reluctant', 'refused']).optional(),
  assistanceNeeded: z.enum(['independent', 'minimal_help', 'full_assistance']).optional(),
  caregiverObservations: z.string().max(1000).optional(),
  reasonNotCompleted: z.string().max(500).optional(),
  idempotencyKey: z.string().max(128).optional(),
});

export type ActivityCompletionInput = z.infer<typeof activityCompletionSchema>;

// Report Generation
export const reportGenerateSchema = z.object({
  childId: z.string().uuid(),
  title: z.string().min(3).max(150),
  reportType: z.enum([
    'initial_assessment',
    'goal_progress',
    'home_adherence',
    'periodic_clinical_review',
    'parent_friendly_summary',
  ]),
  periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  periodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  clinicalNarrative: z.string().max(3000).optional(),
  parentAccessible: z.boolean().default(false),
});

export type ReportGenerateInput = z.infer<typeof reportGenerateSchema>;
