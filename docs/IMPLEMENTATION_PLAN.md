# Zeta Heal (OT Pathway) - Phased Implementation Plan

## Overview
This document tracks the phased implementation of **Zeta Heal** (**OT Pathway**), a production-grade pediatric occupational therapy SaaS platform.

---

## Phase 1: Architecture & Specification (Complete)
- [x] Inspect existing workspace (confirmed empty git repository initialized).
- [x] Document Product Vision and Functional Scope (`docs/PRODUCT_SPEC.md`).
- [x] Document Monorepo System Architecture & Mermaid Diagrams (`docs/ARCHITECTURE.md`).
- [x] Define Relational Database Schema, Foreign Keys & Constraints (`docs/DATABASE_SCHEMA.md`).
- [x] Document Security, RLS Policy Matrix, and Caregiver Protocol (`docs/SECURITY.md`).
- [x] Define API Endpoints, Error Envelopes & Idempotency (`docs/API_REFERENCE.md`).
- [x] Create Implementation Plan (`docs/IMPLEMENTATION_PLAN.md`).

---

## Phase 2: Foundation & Database Migrations
- [x] Configure Monorepo Structure (`apps/web`, `apps/mobile`, `packages/shared-types`, `packages/validation`, `packages/ui-tokens`).
- [ ] Implement `packages/shared-types` (all TypeScript interfaces, domain enums).
- [ ] Implement `packages/validation` (Zod schemas matching database & forms).
- [ ] Implement `packages/ui-tokens` (accessible healthcare palette, typography, spacing).
- [ ] Create PostgreSQL Migrations:
  - `001_initial_schema.sql` (all core tables, types, foreign keys, triggers).
  - `002_row_level_security.sql` (RLS policies for multi-tenancy & caregiver access).
- [ ] Create `supabase/seed.sql` with 20+ pediatric OT activities and synthetic demonstration clinic.
- [ ] Provide `.env.example` and root workspace scripts.

---

## Phase 3: Therapist Web Application (`apps/web`)
- [ ] Initialize Next.js 15+ App Router application with Tailwind CSS and TypeScript.
- [ ] Implement Authentication & Clinic Onboarding:
  - Sign in, registration, session provider, protected layout.
  - Multi-step clinic onboarding wizard (clinic details, owner profile, staff invites, goal domains, activity tour).
- [ ] Main Dashboard with live calculated metrics (active children, programs, reviews, recent feedback).
- [ ] Child Management Directory & Patient Workspace:
  - Patient search, filter, pagination, add child form.
  - Workspace tabs: Overview, Assessments, Goals, Sessions, Home Programs, Timeline, Reports, Caregivers.
- [ ] Assessment Builder:
  - Dynamic template renderer, field validators, draft saving, finalization lock.
- [ ] Functional Goal Management:
  - Goal creation across pediatric domains (Fine Motor, Visual-Motor, ADL, etc.).
  - Goal status transitions, observation logger, numerical trajectory visualizer.
- [ ] Session Documentation:
  - Clinical SOAP-style documentation, assistance levels, response tracking.
- [ ] Activity Library:
  - Interactive search, filter by domain/difficulty, preview modal, custom clinic activities.
- [ ] Home Program Builder:
  - Program creation, activity assignment, goal linkage, prescribed frequency, immutable assignment snapshots.
- [ ] Unified Chronological Progress Timeline:
  - Filterable by source (clinical observations vs. home practice logs).
- [ ] Print-Ready Outcome Reports:
  - Report generator with clinic branding, clinical narrative, objective metrics, and PDF print formatting.

---

## Phase 4: Parent Mobile Application (`apps/mobile`)
- [ ] Setup React Native & Expo mobile project structure.
- [ ] Authentication & Secure Caregiver Invitation Redemption:
  - Token redemption workflow binding caregiver to child.
- [ ] Caregiver Home Screen:
  - Child switcher, today's prescribed activities, completed vs. pending tasks.
- [ ] Activity Detail Screen:
  - Instructions, materials needed, suggested duration, safety tips.
- [ ] Activity Completion Logging:
  - Complete / Partially Complete / Not Complete options.
  - Non-stigmatizing feedback (difficulty, child participation, assistance).
  - Idempotency key tracking for retry safety.
- [ ] Approved Progress Summary:
  - Plain-language progress view for caregiver-permitted milestones.
- [ ] Localization (i18n):
  - English and Tamil translations.

---

## Phase 5: Integration, RLS Security Tests & Multi-Tenant Verification
- [ ] Cross-tenant isolation verification test suite:
  - Clinic 1 vs. Clinic 2 data boundary enforcement.
  - Unauthorized caregiver access prevention.
- [ ] Caregiver invite expiration and single-use validation.
- [ ] Audit event logging verification.

---

## Phase 6: QA, End-to-End Tests & Delivery
- [ ] Automated Unit Tests (validation schemas, goal state transitions, report calculations).
- [ ] Automated Integration & API route tests.
- [ ] Playwright E2E test suite covering full therapist-to-parent clinical loop.
- [ ] Comprehensive documentation: README.md with setup instructions, deployment notes, and architectural summary.
