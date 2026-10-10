# Zeta Heal (OT Pathway) - System Architecture

## 1. System Overview

Zeta Heal is architected as a modern, modular monorepo combining a therapist-facing web application, a caregiver-facing mobile application, and a shared backend infrastructure powered by PostgreSQL and Supabase.

```mermaid
graph TD
    subgraph Clients
        TW[Therapist Web App<br/>Next.js 15+ App Router / React / Tailwind]
        PM[Parent Mobile App<br/>React Native / Expo / TypeScript]
    end

    subgraph "Shared Packages"
        ST[shared-types<br/>TypeScript Interfaces & Enums]
        VAL[validation<br/>Zod Schemas]
        TOK[ui-tokens<br/>Design System Tokens]
    end

    subgraph "Backend Services (Supabase / PostgreSQL)"
        AUTH[Supabase Auth<br/>JWT & Session Management]
        DB[(PostgreSQL Database<br/>RLS Multi-Tenancy & Audit Logs)]
        STORE[Private Object Storage<br/>Clinical Media & Signed URLs]
        EDGE[Protected Edge / API Routes<br/>Privileged Mutations & PDF Generation]
    end

    TW --> ST
    TW --> VAL
    TW --> TOK
    PM --> ST
    PM --> VAL

    TW -->|HTTPS / Supabase Client (RLS)| AUTH
    TW -->|HTTPS / REST / GraphQL| DB
    TW -->|Signed URLs| STORE
    TW -->|Protected SSR API| EDGE

    PM -->|HTTPS / Supabase Client (RLS)| AUTH
    PM -->|HTTPS / Mobile Session| DB
    PM -->|Secure Token Linking| EDGE
```

---

## 2. Monorepo Organization

```
ot-platform/
├── apps/
│   ├── web/                     # Next.js App Router therapist application
│   │   ├── src/
│   │   │   ├── app/             # App router pages (dashboard, patients, goals, etc.)
│   │   │   ├── components/      # UI components (shadcn/ui style, accessible)
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── lib/             # Supabase client, auth helpers, pdf generator
│   │   │   └── styles/          # Tailwind & CSS variables
│   │   ├── public/              # Static assets
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── mobile/                  # React Native / Expo parent application
│       ├── src/
│       │   ├── screens/         # Home, ActivityDetail, Progress, Settings
│       │   ├── navigation/      # Stack & Tab navigators
│       │   ├── components/      # Accessible mobile components
│       │   ├── i18n/            # English & Tamil translations
│       │   └── services/        # Supabase mobile client, storage
│       ├── app.json
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── shared-types/            # Canonical TypeScript types & interfaces
│   │   └── src/index.ts
│   ├── validation/              # Zod schemas for all forms & API payloads
│   │   └── src/index.ts
│   └── ui-tokens/               # Centralized design tokens (colors, spacing, fonts)
│       └── src/index.ts
├── supabase/
│   ├── migrations/              # Incremental SQL migrations with RLS policies
│   ├── seed.sql                 # 20+ demo activities, clinics, synthetic records
│   └── config.toml
├── docs/                        # Architecture, DB schema, Security, API reference
├── package.json                 # Monorepo root workspace configuration
└── README.md
```

---

## 3. Technology Stack & Decision Rationale

### 3.1 Therapist Web Application
- **Next.js (App Router) + React 19 / TypeScript**: Provides server-side rendering for secure initial hydration, protected layout boundaries, and clean server action integration.
- **Tailwind CSS + Custom Accessible Component System**: High-performance CSS without large runtime overhead, strictly adhering to our healthcare color palette.
- **React Hook Form + Zod**: Strict, high-performance form validation preventing invalid clinical records from submitting.
- **Recharts**: Accessible, clean SVG charting for numerical goal trajectories and home compliance.
- **Lucide Icons**: Standardized, clean icon library throughout the web and mobile interfaces.

### 3.2 Parent Mobile Application
- **React Native + Expo**: Cross-platform support for iOS and Android with rapid local development and OTA updates.
- **Expo SecureStore**: Native hardware-backed keystore/keychain storage for auth tokens.
- **i18n-js**: First-class internationalization supporting English and Tamil.
- **Offline Resilient Activity Submission**: In-memory and persisted AsyncStorage queue ensuring network interruptions during home play do not lose caregiver logs.

### 3.3 Backend & Database
- **PostgreSQL 15+ with Supabase**: Enterprise relational database with native JSONB support for extensible assessment schemas and immutable snapshots.
- **Row Level Security (RLS)**: PostgreSQL enforces multi-tenancy at the database engine level. Even if an API endpoint makes a direct query, cross-tenant leaks are mathematically impossible.
- **Private Object Storage**: Patient media and generated PDF reports are stored in private buckets accessible only via short-lived signed URLs.

---

## 4. Multi-Tenant Architecture & Security Boundaries

### 4.1 Tenant Scoping
Each clinic has a unique `clinic_id` (UUID). 
1. Every clinic-owned table (`children`, `assessments`, `goals`, `sessions`, `activities`, `home_programs`) contains a `clinic_id` foreign key.
2. PostgreSQL session variables (`auth.uid()`) identify the calling user.
3. RLS helper functions `is_clinic_member(clinic_id)` and `get_user_role(clinic_id)` verify membership in `clinic_memberships`.

### 4.2 Caregiver-to-Child Scoping
Caregivers belong to a child through the `child_caregivers` junction table:
1. Caregivers can only read children where their `user_id` exists in `child_caregivers` with `status = 'active'`.
2. Caregivers can only read `home_programs` and `home_program_items` where `published = true` for their assigned child.
3. Caregivers can only insert into `activity_completions` for assigned `home_program_items`.

---

## 5. Audit Logging Architecture
Every significant mutation triggers an immutable audit log entry in the `audit_events` table:
- **Actor**: `actor_id` (UUID), `actor_type` (`therapist`, `admin`, `caregiver`, `system`).
- **Target**: `entity_type`, `entity_id`.
- **Event**: `LOGIN`, `RECORD_CREATE`, `ASSESSMENT_FINALIZE`, `GOAL_STATE_CHANGE`, `PROGRAM_PUBLISH`, `COMPLETION_LOGGED`, `REPORT_DOWNLOAD`, `CONSENT_REVOKE`.
- **Metadata**: JSONB snapshot of changes (omitting raw passwords/credentials).
- **Access Rule**: Read-only for Clinic Owners; zero update or delete privileges for any user.
