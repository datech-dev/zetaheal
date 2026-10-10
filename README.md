# Zeta Heal (OT Pathway) - Pediatric Occupational Therapy Platform

> **Clinical Care Coordination & Home Practice Platform**
> *"Help pediatric occupational therapy clinics connect every home activity to a functional goal and understand what happens between therapy sessions."*

---

## 1. Executive Summary & Architecture Overview

**Zeta Heal** (branded as **OT Pathway**) is a pediatric occupational therapy clinic management and care-coordination SaaS platform. It establishes a closed-loop digital workflow between treating occupational therapists and authorized caregivers:

1. **Therapist Web Application (`apps/web`)**: Next.js App Router, React, TypeScript, Tailwind CSS, Lucide icons, accessible healthcare design system, Recharts progress trajectories, extensible assessment builder, session SOAP documentation, and print-ready outcome reports.
2. **Parent Mobile Application (`apps/mobile`)**: Dedicated React Native & Expo application designed for accessible caregiver use, featuring token-based verified child linking, step-by-step instructions with safety guidance, one-tap completion logging, non-stigmatizing feedback, and first-class localization in **English** and **Tamil (தமிழ்)**.
3. **Shared Monorepo Packages (`packages/*`)**:
   - `@zetaheal/shared-types`: Canonical domain TypeScript interfaces and enums.
   - `@zetaheal/validation`: Zod schemas for all forms, APIs, and mutations.
   - `@zetaheal/ui-tokens`: Deep teal healthcare palette, accessible status badges, and typography scales.
4. **Database & Multi-Tenancy (`supabase/`)**: PostgreSQL schema with Row Level Security (RLS) guaranteeing strict tenant isolation between clinics and verified child-level authorization for caregivers. Immutable assignment snapshots ensure historical home programs never mutate when library activities change.

---

## 2. Clinical Boundaries & Non-Goals

- **Clinical Documentation Tool Only**: Zeta Heal does not independently diagnose children, calculate automated medical diagnoses, or prescribe treatments without licensed therapist oversight.
- **Data Source Integrity**: The platform strictly and visually distinguishes therapist-observed clinical measurements from caregiver-reported home practice logs.
- **No AI Clinical Invention**: No autonomous AI diagnostic models are used in clinical decision-making.

---

## 3. Repository Structure

```
ot-platform/
├── apps/
│   ├── web/                     # Next.js 14+ App Router therapist application
│   │   ├── src/app/             # Dashboard, children, workspace, activities, onboarding, reports, audit
│   │   ├── src/components/      # Navbar, Sidebar, accessible modals
│   │   ├── src/context/         # AuthContext & Multi-Tenant simulator
│   │   ├── src/lib/             # Data store, utilities
│   │   └── src/styles/          # Tailwind globals & print CSS
│   └── mobile/                  # React Native / Expo parent companion application
│       ├── src/i18n/            # English & Tamil translations
│       ├── src/services/        # Session storage & idempotency service
│       └── App.tsx              # Mobile home, activity detail, completion logging & progress
├── packages/
│   ├── shared-types/            # Canonical domain TypeScript types
│   ├── validation/              # Zod validation schemas
│   └── ui-tokens/               # Centralized healthcare design tokens
├── supabase/
│   ├── migrations/              # PostgreSQL migrations (schema & RLS policies)
│   ├── seed.sql                 # 20 curated OT activities, demo clinics, synthetic children
│   └── config.toml              # Local Supabase configuration
├── tests/
│   ├── security-multitenancy.test.mjs  # Multi-tenancy isolation & access control test matrix
│   └── clinical-domain.test.mjs       # Zod validation, state machines, and assessment locks
├── docs/
│   ├── PRODUCT_SPEC.md          # Full product requirements and user personas
│   ├── ARCHITECTURE.md          # Monorepo architecture & Mermaid diagrams
│   ├── DATABASE_SCHEMA.md       # Relational schema ERD, tables, foreign keys, indexes
│   ├── SECURITY.md              # Security, RLS matrices, caregiver verification protocol
│   ├── API_REFERENCE.md         # REST endpoints, error envelopes, and idempotency
│   └── IMPLEMENTATION_PLAN.md   # Phased delivery status
├── .env.example
├── package.json                 # Monorepo root workspace configuration
└── README.md
```

---

## 4. Quickstart Setup Guide

### 4.1 Prerequisites
- **Node.js**: v18.0.0 or later (v22 LTS recommended)
- **npm**: v9.0.0 or later

### 4.2 Installation
Clone or navigate to the repository directory and install dependencies:
```bash
npm install
```

Build all shared workspace packages (`@zetaheal/shared-types`, `@zetaheal/validation`, `@zetaheal/ui-tokens`):
```bash
npm run build:packages
```

### 4.3 Running Automated Tests
Run the automated test suite covering multi-tenant isolation, caregiver permissions, immutable program snapshots, idempotency, and form validation:
```bash
npm test
```
All 10 test suites validate zero cross-clinic leakage and strict security boundaries.

### 4.4 Running the Therapist Web Application
Start the Next.js development server:
```bash
npm run dev:web
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Multi-Tenant Simulation Bar:
At the very top of every screen, an interactive **Multi-Tenant Simulator** lets you switch between:
- **Clinics**:
  - `Lotus Pediatric Therapy Center` (Chennai, Tamil Nadu)
  - `Blossom Child Development Clinic` (Bengaluru, Karnataka)
- **Roles**:
  - `Clinic Owner` (Full access, clinic settings, audit events)
  - `Occupational Therapist` (Clinical workspace, assessments, goals, activities, reports)
  - `Clinic Admin` (Administrative operations, restricted clinical records)

Switching clinics instantly demonstrates database isolation: Lotus staff cannot view or edit children enrolled at Blossom.

### 4.5 Running the Parent Mobile Application
The mobile companion app is located in `apps/mobile`:
```bash
npm run dev:mobile
```
Switch between English and Tamil (தமிழ்) using the language toggle in the header.

---

## 5. Security & Privacy Highlights

1. **PostgreSQL Row Level Security (RLS)**: Enforced via `supabase/migrations/20261010000002_row_level_security.sql`. Database queries cannot cross tenant boundaries even if client code is manipulated.
2. **Caregiver Verified Token Linking**: Caregivers cannot guess child IDs. A cryptographically random, SHA-256 hashed 72-hour single-use token binds the caregiver account to the child profile upon redemption.
3. **Immutable Assignment Snapshots**: When a library activity is edited, historical published home programs retain their exact assigned text and instructions (`snapshot_instructions`).
4. **Idempotency Protection**: Mobile completion requests include unique `X-Idempotency-Key` headers preventing duplicate submissions during network retries.
5. **De-Identified URLs**: Child names and birth dates are never used in URLs; opaque UUIDs are used exclusively.
6. **Immutable Audit Events**: All significant clinical mutations (record creation, assessment locks, goal state changes, program publications) generate non-deletable audit log entries.

---

## 6. Demonstration Dataset Included

The repository includes a comprehensive synthetic demonstration environment (`supabase/seed.sql` and `apps/web/src/lib/data-store.ts`):
- **2 Demonstration Clinics**: Lotus Pediatric Therapy & Blossom Child Development.
- **3 Synthetic Children**:
  - `Aarav Sundaram` (Age 6, fine motor and pencil grasp fatigue)
  - `Diya Venkatesh` (Age 4, sensory processing and texture tolerance)
  - `Vihaan Patel` (Age 5, bilateral coordination at Blossom Clinic)
- **20 Curated Pediatric OT Activities**: Safe, generic demonstration interventions spanning Fine Motor, Bilateral Coordination, Visual-Motor Integration, Gross Motor / Proprioception, Self-Care (ADL), Handwriting Readiness, Oral-Motor, and Play.
- **Historical Goal Trajectories**: Numerical measurements rendered dynamically with Recharts trend lines.
- **Caregiver Submissions**: Real completion logs with difficulty ratings, child enthusiasm metrics, and qualitative observations.
- **Print-Ready Clinical Reports**: Formatted with clinic branding, clinical narrative, and therapist sign-off.
