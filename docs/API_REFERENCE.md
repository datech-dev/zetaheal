# Zeta Heal (OT Pathway) - API Reference

## 1. Conventions & Standards

### 1.1 Base URL & Content Negotiation
- Web API Routes: `/api/v1/*`
- All requests and responses are strictly `application/json` (except report PDF downloads: `application/pdf`).
- Authentication: Standard `Authorization: Bearer <supabase_jwt>` header.

### 1.2 Structured Response Envelope
Success responses return HTTP 200/201 with data:
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-10-10T10:00:00Z"
  }
}
```

Error responses return appropriate HTTP 4xx/5xx codes with an explicit structured payload:
```json
{
  "success": false,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You are not authorized to view this patient record.",
    "details": []
  }
}
```

### 1.3 Idempotency
For operations subject to mobile retry (e.g. `POST /api/mobile/completions`), clients must include:
`X-Idempotency-Key: <UUIDv4>`
Subsequent requests with the same key return the stored result without duplicate database mutations.

---

## 2. API Endpoints

### 2.1 Clinic Onboarding & Workspace
- `POST /api/v1/clinic/onboard`
  - Body: `{ clinicName, contactEmail, contactPhone, address, timezone, defaultLanguage, ownerDisplayName }`
  - Returns: `{ clinicId, status: "active" }`
- `GET /api/v1/clinic/dashboard`
  - Returns calculated live statistics: `{ activeChildren, activeHomePrograms, upcomingReviews, recentSubmissions, goalsDueForReview }`

### 2.2 Child Management
- `GET /api/v1/children`
  - Query params: `search`, `status`, `page`, `limit`
  - Returns: Paginated list of children scoped to the caller's clinic.
- `POST /api/v1/children`
  - Body: `{ firstName, lastName, dateOfBirth, gender, clinicalHistory, functionalConcerns, assignedTherapistId }`
- `GET /api/v1/children/:id`
  - Returns child profile + authorized relational summaries.
- `PATCH /api/v1/children/:id`
  - Update allowed clinical profile fields.

### 2.3 Caregiver Invitations & Mobile Linking
- `POST /api/v1/children/:id/caregivers/invite`
  - Body: `{ email, relationship, canViewProgress }`
  - Returns: `{ inviteToken, expiresAt }`
- `POST /api/v1/mobile/caregivers/redeem-invite`
  - Body: `{ inviteToken }`
  - Returns: `{ childId, relationship, clinicName }`

### 2.4 Assessments
- `GET /api/v1/assessment-templates`
  - Returns clinic and system evaluation templates.
- `POST /api/v1/assessments`
  - Body: `{ childId, templateVersionId, assessmentDate, responses }`
  - Status: `draft`
- `POST /api/v1/assessments/:id/finalize`
  - Body: `{ clinicalInterpretation, nextReviewDate }`
  - Locks the assessment and transitions status to `finalized`.

### 2.5 Functional Goals
- `POST /api/v1/goals`
  - Body: `{ childId, domain, title, functionalDescription, baselineValue, baselineNumeric, targetValue, targetNumeric, measurementUnit, startDate, targetReviewDate }`
- `PATCH /api/v1/goals/:id/status`
  - Body: `{ status: "active" | "paused" | "achieved" | "discontinued", reason }`
- `POST /api/v1/goals/:id/observations`
  - Body: `{ observationDate, source, measuredNumeric, measuredQualitative, clinicalNotes }`

### 2.6 Clinical Sessions
- `POST /api/v1/sessions`
  - Body: `{ childId, sessionDate, durationMinutes, objectiveObservations, assistanceLevel, interventionResponse, planForNextSession, goalsAddressed: [{ goalId, progressNotes }] }`

### 2.7 Activity Library
- `GET /api/v1/activities`
  - Filters: `category`, `search`, `difficulty`
  - Returns curated and clinic-specific activity catalog.
- `POST /api/v1/activities`
  - Body: `{ title, category, description, instructions, functionalPurpose, materialsNeeded, estimatedDurationMinutes, suggestedFrequency, safetyGuidance, supervisionGuidance }`

### 2.8 Home Programs
- `POST /api/v1/home-programs`
  - Body: `{ childId, title, notesForCaregiver, startDate, endDate, items: [{ activityId, linkedGoalId, prescribedFrequency, prescribedDurationMinutes, specialNotes }] }`
- `POST /api/v1/home-programs/:id/publish`
  - Locks assignment snapshots and publishes to the authorized caregiver.
- `GET /api/v1/mobile/home-programs/active`
  - Returns active assigned programs for the authenticated caregiver's child.

### 2.9 Mobile Activity Logging
- `POST /api/v1/mobile/completions`
  - Body: `{ homeProgramItemId, completionDate, status: "completed" | "partially_completed" | "not_completed", difficultyExperienced, childEngagement, assistanceNeeded, caregiverObservations, reasonNotCompleted }`
  - Header: `X-Idempotency-Key`

### 2.10 Reports & Export
- `POST /api/v1/reports/generate`
  - Body: `{ childId, reportType, periodStart, periodEnd, clinicalNarrative, parentAccessible }`
  - Generates report record and builds PDF document.
- `GET /api/v1/reports/:id/download`
  - Returns print-ready PDF stream.
