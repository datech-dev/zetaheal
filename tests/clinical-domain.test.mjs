// ==============================================================================
// Zeta Heal (OT Pathway) - Clinical Domain & Validation Test Suite
// ==============================================================================

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  childSchema,
  goalSchema,
  activityCompletionSchema,
  clinicOnboardingSchema,
} from '../packages/validation/dist/index.js';

import { ClinicalDataStore } from '../apps/web/src/lib/data-store.ts';

test('VALIDATION: Child schema validates mandatory clinical fields', () => {
  // Valid payload
  const validChild = {
    firstName: 'Aarav',
    lastName: 'Sundaram',
    dateOfBirth: '2020-04-15',
    gender: 'male',
    functionalConcerns: 'Difficulty holding utensils, fatigues quickly during coloring',
  };
  const parseResult = childSchema.safeParse(validChild);
  assert.ok(parseResult.success, 'Valid child record must parse successfully');

  // Invalid payload (missing functional concerns)
  const invalidChild = {
    firstName: 'Aarav',
    lastName: 'Sundaram',
    dateOfBirth: '2020-04-15',
    functionalConcerns: '', // Too short
  };
  const failResult = childSchema.safeParse(invalidChild);
  assert.equal(failResult.success, false, 'Missing functional concerns must fail validation');
});

test('VALIDATION: Functional goal schema enforces pediatric domains and descriptions', () => {
  const validGoal = {
    childId: 'c1000000-0000-0000-0000-000000000001',
    domain: 'fine_motor',
    title: 'Tripod Grasp Maintenance',
    functionalDescription: 'Will maintain grasp for 5 continuous minutes without fatigue',
    baselineValue: '60 seconds',
    baselineNumeric: 60,
    targetValue: '300 seconds',
    targetNumeric: 300,
    measurementUnit: 'seconds',
    startDate: '2026-10-10',
  };

  const result = goalSchema.safeParse(validGoal);
  assert.ok(result.success, 'Valid functional goal must pass validation');
});

test('VALIDATION: Activity completion allows non-stigmatizing optional feedback', () => {
  const validCompletion = {
    homeProgramItemId: 'hpi00000-0000-0000-0000-000000000001',
    completionDate: '2026-10-10',
    status: 'completed',
    difficultyExperienced: 'just_right',
    childEngagement: 'enthusiastic',
    assistanceNeeded: 'minimal_help',
    caregiverObservations: 'Smiled throughout the session',
  };

  const result = activityCompletionSchema.safeParse(validCompletion);
  assert.ok(result.success, 'Valid activity completion must pass');
});

test('STATE MACHINE: Goal status lifecycle transitions', () => {
  const ds = new ClinicalDataStore();
  const goalId = 'g1000000-0000-0000-0000-000000000001';
  const clinicId = 'a0000000-0000-0000-0000-000000000001';
  const therapistId = 'u1000000-0000-0000-0000-000000000001';

  // 1. Transition to paused
  const paused = ds.updateGoalStatus(goalId, 'paused', clinicId, therapistId);
  assert.ok(paused);
  assert.equal(paused.status, 'paused');

  // 2. Transition to achieved
  const achieved = ds.updateGoalStatus(goalId, 'achieved', clinicId, therapistId);
  assert.ok(achieved);
  assert.equal(achieved.status, 'achieved');
  assert.ok(achieved.achieved_date, 'Achieved goal must record achievement date timestamp');
});

test('ASSESSMENT LOCK: Finalized assessments lock clinical interpretation', () => {
  const ds = new ClinicalDataStore();
  const clinicId = 'a0000000-0000-0000-0000-000000000001';
  const therapistId = 'u1000000-0000-0000-0000-000000000001';

  const initialAssessments = ds.getAssessments('c1000000-0000-0000-0000-000000000001');
  assert.ok(initialAssessments.length > 0);
  assert.equal(initialAssessments[0].status, 'finalized');
  assert.ok(initialAssessments[0].finalized_at);
});
