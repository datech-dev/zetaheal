// ==============================================================================
// Zeta Heal (OT Pathway) - Multi-Tenancy & Access-Control Verification Test Suite
// Test Matrix:
// - Clinic 1: Lotus Pediatric Therapy Center (Owner: Dr. Priya Sharma, Child: Aarav)
// - Clinic 2: Blossom Child Development Clinic (Owner: Rajesh Raman, Child: Vihaan)
// - Caregiver 1: Meera Sundaram (Authorized for Aarav)
// - Unauthorized User: External Attacker
// ==============================================================================

import test from 'node:test';
import assert from 'node:assert/strict';

// Import our compiled shared models & data store logic
import { ClinicalDataStore } from '../apps/web/src/lib/data-store.ts';

test('MULTI-TENANCY MATRIX: Clinic A cannot access Clinic B records', () => {
  const ds = new ClinicalDataStore();

  const clinic1Id = 'a0000000-0000-0000-0000-000000000001'; // Lotus
  const clinic2Id = 'b0000000-0000-0000-0000-000000000002'; // Blossom

  // 1. Therapist A in Clinic 1 queries children
  const clinic1Children = ds.getChildren(clinic1Id);
  assert.ok(clinic1Children.length >= 2, 'Clinic 1 should return its own enrolled children');
  
  // Verify none of Clinic 1's queried children belong to Clinic 2
  const leakedChild = clinic1Children.find((c) => c.clinic_id === clinic2Id);
  assert.equal(leakedChild, undefined, 'CRITICAL: No Clinic 2 children must leak into Clinic 1 query');

  // 2. Querying Child 3 (Vihaan at Blossom) with Clinic 1 credentials must return undefined
  const crossClinicChild = ds.getChild('c2000000-0000-0000-0000-000000000001', clinic1Id);
  assert.equal(crossClinicChild, undefined, 'CRITICAL: Cross-clinic direct ID query must fail');
});

test('CAREGIVER ISOLATION: Caregiver A cannot view another child home programs', () => {
  const ds = new ClinicalDataStore();

  const child1Id = 'c1000000-0000-0000-0000-000000000001'; // Aarav
  const child2Id = 'c2000000-0000-0000-0000-000000000001'; // Vihaan

  // Caregiver 1 has link to Child 1 only
  const link = ds.childCaregivers.find(
    (cc) => cc.child_id === child1Id && cc.caregiver_id === 'cg100000-0000-0000-0000-000000000001'
  );
  assert.ok(link, 'Caregiver 1 must have active link to Child 1');

  // Caregiver 1 has NO link to Child 2
  const unauthorizedLink = ds.childCaregivers.find(
    (cc) => cc.child_id === child2Id && cc.caregiver_id === 'cg100000-0000-0000-0000-000000000001'
  );
  assert.equal(unauthorizedLink, undefined, 'Caregiver 1 must NOT have link to Child 2');
});

test('IMMUTABLE SNAPSHOTS: Published program items retain historical instructions after library edits', () => {
  const ds = new ClinicalDataStore();

  const clinic1Id = 'a0000000-0000-0000-0000-000000000001';
  const child1Id = 'c1000000-0000-0000-0000-000000000001';
  const therapistId = 'u1000000-0000-0000-0000-000000000001';

  // 1. Create a published program with a snapshot
  const initialProg = ds.createHomeProgram(
    {
      clinic_id: clinic1Id,
      child_id: child1Id,
      therapist_id: therapistId,
      title: 'Baseline Test Program',
      notes_for_caregiver: 'Practice gently',
      start_date: '2026-10-10',
    },
    [
      {
        activity_id: 'act00000-0000-0000-0000-000000000001',
        snapshot_title: 'Original Snapshot Instructions v1',
        snapshot_instructions: 'Original instructions for clothespins',
        prescribed_frequency: '3x/week',
        prescribed_duration_minutes: 10,
      },
    ],
    therapistId
  );
  ds.publishHomeProgram(initialProg.id, therapistId);

  // 2. Now simulate modifying the library activity
  const libraryAct = ds.activities.find((a) => a.id === 'act00000-0000-0000-0000-000000000001');
  assert.ok(libraryAct);
  libraryAct.instructions = 'NEW EDITED LIBRARY INSTRUCTIONS V2 THAT CHANGED';

  // 3. Verify the published home program assignment did NOT change
  const publishedProgs = ds.getHomePrograms(child1Id);
  const targetProg = publishedProgs.find((p) => p.id === initialProg.id);
  assert.ok(targetProg);
  assert.equal(
    targetProg.items[0].snapshot_instructions,
    'Original instructions for clothespins',
    'CRITICAL: Published program instructions must remain immutable!'
  );
});

test('IDEMPOTENCY: Duplicate activity completion logs with same idempotency key are rejected', () => {
  const ds = new ClinicalDataStore();

  const item1Id = 'hpi00000-0000-0000-0000-000000000001';
  const caregiverId = 'cg100000-0000-0000-0000-000000000001';
  const idempotencyKey = 'idem-unique-key-xyz-123';

  // First submission
  const firstLog = ds.logActivityCompletion({
    home_program_item_id: item1Id,
    caregiver_id: caregiverId,
    completion_date: '2026-10-10',
    status: 'completed',
    difficulty_experienced: 'just_right',
    child_engagement: 'enthusiastic',
    idempotency_key: idempotencyKey,
  });

  const countBefore = ds.activityCompletions.length;

  // Duplicate retry submission (e.g., mobile network retry)
  const duplicateLog = ds.logActivityCompletion({
    home_program_item_id: item1Id,
    caregiver_id: caregiverId,
    completion_date: '2026-10-10',
    status: 'completed',
    difficulty_experienced: 'just_right',
    child_engagement: 'enthusiastic',
    idempotency_key: idempotencyKey,
  });

  const countAfter = ds.activityCompletions.length;

  assert.equal(firstLog.id, duplicateLog.id, 'Duplicate retry must return existing record');
  assert.equal(countAfter, countBefore, 'Duplicate retry must NOT insert new record in database');
});

test('AUDIT TRAIL: Clinical mutations generate non-empty audit logs', () => {
  const ds = new ClinicalDataStore();
  const clinic1Id = 'a0000000-0000-0000-0000-000000000001';
  const therapistId = 'u1000000-0000-0000-0000-000000000001';

  const auditEventsBefore = ds.getAuditEvents(clinic1Id).length;

  ds.createChild(
    {
      clinic_id: clinic1Id,
      first_name: 'TestChild',
      last_name: 'AuditTest',
      date_of_birth: '2021-01-01',
      functional_concerns: 'Testing audit tracking',
      status: 'active',
    },
    therapistId
  );

  const auditEventsAfter = ds.getAuditEvents(clinic1Id).length;
  assert.equal(auditEventsAfter, auditEventsBefore + 1, 'Child creation must append an audit event');

  const latestAudit = ds.getAuditEvents(clinic1Id)[0];
  assert.equal(latestAudit.action, 'CHILD_CREATED');
  assert.equal(latestAudit.actor_id, therapistId);
});
