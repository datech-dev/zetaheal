// ==============================================================================
// Zeta Heal (OT Pathway) - In-Memory & Persisted Clinical Data Store
// ==============================================================================

import type {
  Clinic,
  UserProfile,
  Child,
  Caregiver,
  ChildCaregiver,
  Goal,
  GoalObservation,
  Activity,
  HomeProgram,
  HomeProgramItem,
  ActivityCompletion,
  Session,
  Assessment,
  AssessmentTemplate,
  Report,
  AuditEvent,
  ClinicDashboardSummary,
  UUID,
} from '@zetaheal/shared-types';

export class ClinicalDataStore {
  public clinics: Clinic[] = [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Lotus Pediatric Therapy Center',
      subdomain: 'lotus-ot',
      contact_email: 'admin@lotuspediatric.example',
      contact_phone: '+91 44 2499 1234',
      address: {
        street: '42 Greenways Road, RA Puram',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postal_code: '600028',
        country: 'India',
      },
      timezone: 'Asia/Kolkata',
      default_language: 'en',
      created_at: '2026-08-01T09:00:00Z',
      updated_at: '2026-08-01T09:00:00Z',
    },
    {
      id: 'b0000000-0000-0000-0000-000000000002',
      name: 'Blossom Child Development Clinic',
      subdomain: 'blossom-cdc',
      contact_email: 'contact@blossomchild.example',
      contact_phone: '+91 80 4123 5678',
      address: {
        street: '18 Koramangala 4th Block',
        city: 'Bengaluru',
        state: 'Karnataka',
        postal_code: '560034',
        country: 'India',
      },
      timezone: 'Asia/Kolkata',
      default_language: 'en',
      created_at: '2026-08-15T09:00:00Z',
      updated_at: '2026-08-15T09:00:00Z',
    },
  ];

  public users: UserProfile[] = [
    {
      id: 'u1000000-0000-0000-0000-000000000001',
      display_name: 'Dr. Priya Sharma, MOT, OTR',
      email: 'priya.sharma@lotuspediatric.example',
      phone_number: '+91 98400 11223',
      language_preference: 'en',
      created_at: '2026-08-01T09:00:00Z',
      updated_at: '2026-08-01T09:00:00Z',
    },
    {
      id: 'u1000000-0000-0000-0000-000000000002',
      display_name: 'Ananya Krishnan, BOT',
      email: 'ananya.k@lotuspediatric.example',
      phone_number: '+91 98400 22334',
      language_preference: 'en',
      created_at: '2026-08-05T09:00:00Z',
      updated_at: '2026-08-05T09:00:00Z',
    },
    {
      id: 'u2000000-0000-0000-0000-000000000001',
      display_name: 'Rajesh Raman, MOT',
      email: 'rajesh.r@blossomchild.example',
      phone_number: '+91 98400 33445',
      language_preference: 'en',
      created_at: '2026-08-15T09:00:00Z',
      updated_at: '2026-08-15T09:00:00Z',
    },
    {
      id: 'u3000000-0000-0000-0000-000000000001',
      display_name: 'Meera Sundaram (Mother)',
      email: 'meera.sundaram@example.com',
      phone_number: '+91 99620 44556',
      language_preference: 'en',
      created_at: '2026-09-01T09:00:00Z',
      updated_at: '2026-09-01T09:00:00Z',
    },
  ];

  public children: Child[] = [
    {
      id: 'c1000000-0000-0000-0000-000000000001',
      clinic_id: 'a0000000-0000-0000-0000-000000000001',
      first_name: 'Aarav',
      last_name: 'Sundaram',
      date_of_birth: '2020-04-15',
      gender: 'male',
      clinical_history: 'Referred by pediatrician for fine motor delays, difficulties with tripod pencil grasp, and fatigue during handwriting activities.',
      functional_concerns: 'Difficulty holding utensils, fatigues quickly during coloring, struggles to fasten buttons independently.',
      assigned_therapist_id: 'u1000000-0000-0000-0000-000000000001',
      status: 'active',
      created_at: '2026-09-01T09:30:00Z',
      updated_at: '2026-09-01T09:30:00Z',
    },
    {
      id: 'c1000000-0000-0000-0000-000000000002',
      clinic_id: 'a0000000-0000-0000-0000-000000000001',
      first_name: 'Diya',
      last_name: 'Venkatesh',
      date_of_birth: '2022-09-08',
      gender: 'female',
      clinical_history: 'Sensory processing differences, tactile defensiveness with messy textures, seeking proprioceptive input through repetitive jumping.',
      functional_concerns: 'Aversion to finger painting/textures, difficulty settling for bedtime, needs frequent proprioceptive breaks during play.',
      assigned_therapist_id: 'u1000000-0000-0000-0000-000000000002',
      status: 'active',
      created_at: '2026-09-10T11:00:00Z',
      updated_at: '2026-09-10T11:00:00Z',
    },
    {
      id: 'c2000000-0000-0000-0000-000000000001',
      clinic_id: 'b0000000-0000-0000-0000-000000000002',
      first_name: 'Vihaan',
      last_name: 'Patel',
      date_of_birth: '2021-02-20',
      gender: 'male',
      clinical_history: 'Bilateral coordination challenges and difficulties with motor planning for school-readiness tasks.',
      functional_concerns: 'Difficulty with scissor cutting and stabilizing paper with non-dominant hand.',
      assigned_therapist_id: 'u2000000-0000-0000-0000-000000000001',
      status: 'active',
      created_at: '2026-09-15T10:00:00Z',
      updated_at: '2026-09-15T10:00:00Z',
    },
  ];

  public caregivers: Caregiver[] = [
    {
      id: 'cg100000-0000-0000-0000-000000000001',
      user_id: 'u3000000-0000-0000-0000-000000000001',
      email: 'meera.sundaram@example.com',
      phone_number: '+91 99620 44556',
      preferred_contact_method: 'email',
      created_at: '2026-09-01T09:30:00Z',
      updated_at: '2026-09-01T09:30:00Z',
    },
  ];

  public childCaregivers: ChildCaregiver[] = [
    {
      id: 'cc100000-0000-0000-0000-000000000001',
      child_id: 'c1000000-0000-0000-0000-000000000001',
      caregiver_id: 'cg100000-0000-0000-0000-000000000001',
      relationship: 'mother',
      invite_token: 'valid-demo-token-aarav',
      invite_expires_at: '2026-12-31T23:59:59Z',
      status: 'active',
      can_view_progress: true,
      created_at: '2026-09-01T09:30:00Z',
      updated_at: '2026-09-01T09:30:00Z',
    },
  ];

  public goals: Goal[] = [
    {
      id: 'g1000000-0000-0000-0000-000000000001',
      clinic_id: 'a0000000-0000-0000-0000-000000000001',
      child_id: 'c1000000-0000-0000-0000-000000000001',
      responsible_therapist_id: 'u1000000-0000-0000-0000-000000000001',
      domain: 'fine_motor',
      title: 'Dynamic Tripod Grasp on Writing Utensils',
      functional_description: 'Aarav will maintain a dynamic tripod grasp with open web space while writing or coloring for 5 continuous minutes without hand cramping.',
      baseline_value: 'Uses static digital pronate grasp; fatigues after 60 seconds.',
      baseline_numeric: 60,
      target_value: 'Maintains dynamic tripod grasp for 300 seconds (5 min).',
      target_numeric: 300,
      measurement_unit: 'seconds',
      status: 'active',
      start_date: '2026-09-01',
      target_review_date: '2026-11-01',
      notes: 'Shows good motivation when using brightly colored crayons.',
      created_at: '2026-09-01T10:00:00Z',
      updated_at: '2026-09-29T10:00:00Z',
    },
    {
      id: 'g1000000-0000-0000-0000-000000000002',
      clinic_id: 'a0000000-0000-0000-0000-000000000001',
      child_id: 'c1000000-0000-0000-0000-000000000001',
      responsible_therapist_id: 'u1000000-0000-0000-0000-000000000001',
      domain: 'self_care',
      title: 'Independent Shirt Buttoning (Medium Buttons)',
      functional_description: 'Aarav will independently button a 4-button school uniform shirt within 2 minutes with no more than 1 verbal prompt.',
      baseline_value: 'Requires full physical assistance to line up and push buttons (0 of 4).',
      baseline_numeric: 0,
      target_value: 'Fastens all 4 buttons independently.',
      target_numeric: 4,
      measurement_unit: 'buttons fastened',
      status: 'active',
      start_date: '2026-09-01',
      target_review_date: '2026-11-15',
      notes: 'Button snake home activity assigned to reinforce bilateral manipulation.',
      created_at: '2026-09-01T10:15:00Z',
      updated_at: '2026-09-22T10:15:00Z',
    },
  ];

  public goalObservations: GoalObservation[] = [
    {
      id: 'go100000-0000-0000-0000-000000000001',
      goal_id: 'g1000000-0000-0000-0000-000000000001',
      recorded_by: 'u1000000-0000-0000-0000-000000000001',
      observation_date: '2026-09-01',
      source: 'therapist_in_clinic',
      measured_numeric: 60,
      measured_qualitative: 'Static pronate grasp observed with tight pressure.',
      clinical_notes: 'Initial clinical assessment baseline.',
      created_at: '2026-09-01T10:00:00Z',
    },
    {
      id: 'go100000-0000-0000-0000-000000000002',
      goal_id: 'g1000000-0000-0000-0000-000000000001',
      recorded_by: 'u1000000-0000-0000-0000-000000000001',
      observation_date: '2026-09-15',
      source: 'therapist_in_clinic',
      measured_numeric: 120,
      measured_qualitative: 'Transitional quadrupod grasp with slight wrist flexion.',
      clinical_notes: 'Endurance improved; less hand shaking.',
      created_at: '2026-09-15T11:00:00Z',
    },
    {
      id: 'go100000-0000-0000-0000-000000000003',
      goal_id: 'g1000000-0000-0000-0000-000000000001',
      recorded_by: 'u1000000-0000-0000-0000-000000000001',
      observation_date: '2026-09-29',
      source: 'therapist_in_clinic',
      measured_numeric: 190,
      measured_qualitative: 'Dynamic tripod emerging; maintained for 3+ minutes.',
      clinical_notes: 'Demonstrates open web space with triangular pencil grip.',
      created_at: '2026-09-29T11:00:00Z',
    },
    {
      id: 'go100000-0000-0000-0000-000000000004',
      goal_id: 'g1000000-0000-0000-0000-000000000002',
      recorded_by: 'u1000000-0000-0000-0000-000000000001',
      observation_date: '2026-09-01',
      source: 'therapist_in_clinic',
      measured_numeric: 0,
      measured_qualitative: 'Could not coordinate pushing button through hole.',
      clinical_notes: 'Initial evaluation.',
      created_at: '2026-09-01T10:15:00Z',
    },
    {
      id: 'go100000-0000-0000-0000-000000000005',
      goal_id: 'g1000000-0000-0000-0000-000000000002',
      recorded_by: 'u1000000-0000-0000-0000-000000000001',
      observation_date: '2026-09-22',
      source: 'therapist_in_clinic',
      measured_numeric: 2,
      measured_qualitative: 'Completed 2 buttons independently with verbal cues.',
      clinical_notes: 'Button snake home practice showing direct carryover.',
      created_at: '2026-09-22T10:30:00Z',
    },
  ];

  public activities: Activity[] = [
    {
      id: 'act00000-0000-0000-0000-000000000001',
      title: 'Clothespin Color Match',
      category: 'Fine Motor Skills',
      description: 'Using wooden spring clothespins to pinch and match colored paper cards around a circular cardboard rim.',
      instructions: '1. Seat child with elbows at 90 degrees.\n2. Provide 6 colored clothespins and matching color wheel.\n3. Coach child to pinch the pin using pads of thumb and index finger (pincer grasp), avoiding whole-hand grasping.\n4. Clip each pin to its matching color sector.',
      functional_purpose: 'Builds intrinsic hand muscle strength and strengthens dynamic 2-point pincer grasp required for pencil control and utensil use.',
      materials_needed: '6 wooden spring clothespins, sturdy cardboard circle colored into 6 sectors.',
      estimated_duration_minutes: 10,
      suggested_frequency: '4 times per week',
      difficulty_level: 'moderate',
      safety_guidance: 'Watch for pinching soft skin; ensure wooden pins do not have splinters.',
      supervision_guidance: 'Direct parent supervision during pinching.',
      status: 'published',
      created_at: '2026-08-01T00:00:00Z',
      updated_at: '2026-08-01T00:00:00Z',
    },
    {
      id: 'act00000-0000-0000-0000-000000000002',
      title: 'Playdough Finger Pinch & Meatball Roll',
      category: 'Fine Motor Skills',
      description: 'Rolling therapeutic playdough into small spheres using finger pads and pinching them flat.',
      instructions: '1. Break off grape-sized piece of dough.\n2. Roll into a ball using only index, middle finger and thumb.\n3. Once round, pinch flat with thumb and index finger tips.',
      functional_purpose: 'Develops radial finger isolation, arches of the hand, and graded fingertip force control.',
      materials_needed: 'Non-toxic playdough or sensory putty.',
      estimated_duration_minutes: 15,
      suggested_frequency: 'Daily',
      difficulty_level: 'easy',
      safety_guidance: 'Non-toxic dough only. Keep away from mouths for younger children.',
      supervision_guidance: 'Caregiver guided demonstration.',
      status: 'published',
      created_at: '2026-08-01T00:00:00Z',
      updated_at: '2026-08-01T00:00:00Z',
    },
    {
      id: 'act00000-0000-0000-0000-000000000003',
      title: 'Lacing Bead Tower',
      category: 'Bilateral Coordination',
      description: 'Threading wooden beads onto a tipped lace while stabilizing the string with the non-dominant hand.',
      instructions: '1. Hold lace in non-dominant hand.\n2. Use dominant hand to pick up bead with pincer grasp.\n3. Guide lace through the hole and pull through to form a pattern.',
      functional_purpose: 'Enhances bimanual coordination, eye-hand alignment, and midline crossing.',
      materials_needed: 'Large wooden beads (1.5 inch), tipped shoelace.',
      estimated_duration_minutes: 15,
      suggested_frequency: '3 times per week',
      difficulty_level: 'moderate',
      safety_guidance: 'Choking hazard: use beads larger than 1.25 inches for children under 5.',
      supervision_guidance: 'Supervised table activity.',
      status: 'published',
      created_at: '2026-08-01T00:00:00Z',
      updated_at: '2026-08-01T00:00:00Z',
    },
    {
      id: 'act00000-0000-0000-0000-000000000004',
      title: 'Scissor Maze Trail',
      category: 'Visual-Motor Integration',
      description: 'Cutting along straight and curved lines on heavy paper to guide a character to a finish line.',
      instructions: '1. Scissor grip: thumb in top loop pointing up, middle/ring in bottom loop.\n2. Non-dominant hand holds and rotates paper while dominant hand snips along line.',
      functional_purpose: 'Develops helper hand paper rotation, distal scissor control, and visual tracking along a path.',
      materials_needed: 'Child safety scissors (blunt tip), printed paths on heavy cardstock.',
      estimated_duration_minutes: 12,
      suggested_frequency: '3 times per week',
      difficulty_level: 'moderate',
      safety_guidance: 'Safety scissors only. Keep non-cutting fingers behind blade.',
      supervision_guidance: 'Direct 1-on-1 parent supervision.',
      status: 'published',
      created_at: '2026-08-01T00:00:00Z',
      updated_at: '2026-08-01T00:00:00Z',
    },
    {
      id: 'act00000-0000-0000-0000-000000000005',
      title: 'Animal Walk Safari Obstacle Course',
      category: 'Gross Motor & Proprioceptive',
      description: 'Imitating animal movements across the living room carpet (Bear crawl, Crab walk, Frog jumps).',
      instructions: '1. Bear Walk: Hands and feet on ground with hips raised, walk 10 feet.\n2. Crab Walk: Hands and feet behind back, belly up.\n3. Frog Jump: Deep squat to jump forward.',
      functional_purpose: 'Delivers heavy work (proprioceptive input) to shoulders, core, and hips to promote joint stability and sensory regulation.',
      materials_needed: 'Open floor space or carpet, small cushions as stepping markers.',
      estimated_duration_minutes: 15,
      suggested_frequency: 'Daily before seatwork',
      difficulty_level: 'moderate',
      safety_guidance: 'Clear obstacles and sharp furniture corners before starting.',
      supervision_guidance: 'Adult enthusiastic participation and pacing.',
      status: 'published',
      created_at: '2026-08-01T00:00:00Z',
      updated_at: '2026-08-01T00:00:00Z',
    },
    {
      id: 'act00000-0000-0000-0000-000000000006',
      title: 'Button Snake Practice',
      category: 'Self-Care (ADL)',
      description: 'Pushing felt shapes with buttonholes along a ribbon with a large button sewn to the end.',
      instructions: '1. Hold felt shape with one hand.\n2. Tilt button sideways and push through slit with other hand.\n3. Pull shape down to ribbon end.',
      functional_purpose: 'Direct functional practice for fastening buttons on shirts and jackets without garment frustration.',
      materials_needed: 'Ribbon with 1-inch wooden button sewn on end, 8-10 felt squares with slits.',
      estimated_duration_minutes: 10,
      suggested_frequency: '4 times per week',
      difficulty_level: 'moderate',
      safety_guidance: 'Ensure button is securely stitched to avoid detachment.',
      supervision_guidance: 'Caregiver encouraging stepwise independence.',
      status: 'published',
      created_at: '2026-08-01T00:00:00Z',
      updated_at: '2026-08-01T00:00:00Z',
    },
    {
      id: 'act00000-0000-0000-0000-000000000007',
      title: 'Tweezer Pom-Pom Color Sort',
      category: 'Fine Motor Skills',
      description: 'Using child plastic tweezers to transfer soft craft pom-poms into an ice cube tray by color.',
      instructions: '1. Hold tweezers with thumb on one side and index/middle on opposite side.\n2. Squeeze to pick up a pom-pom.\n3. Maintain squeeze while moving to target compartment.',
      functional_purpose: 'Improves web space opening, hand separation, and sustained motor endurance for writing.',
      materials_needed: 'Child training tweezers, multi-colored craft pom-poms (1 inch), empty ice cube tray.',
      estimated_duration_minutes: 12,
      suggested_frequency: '4 times per week',
      difficulty_level: 'easy',
      safety_guidance: 'Keep small pom-poms away from toddlers.',
      supervision_guidance: 'Supervised play.',
      status: 'published',
      created_at: '2026-08-01T00:00:00Z',
      updated_at: '2026-08-01T00:00:00Z',
    },
    {
      id: 'act00000-0000-0000-0000-000000000008',
      title: 'Shaving Cream Pre-Writing Tracing',
      category: 'Sensory & Handwriting Readiness',
      description: 'Spreading non-menthol shaving cream on a plastic tray and drawing pre-writing shapes (lines, circles, crosses).',
      instructions: '1. Spread thin layer of foam over tray.\n2. Parent demonstrates drawing vertical line (|), horizontal line (-), and cross (+).\n3. Child imitates with pointer finger.',
      functional_purpose: 'Desensitizes tactile hypersensitivity while reinforcing pre-writing strokes through multi-sensory feedback.',
      materials_needed: 'Baking sheet or plastic tray, hypoallergenic shaving foam or whipped cream.',
      estimated_duration_minutes: 15,
      suggested_frequency: '2 times per week',
      difficulty_level: 'moderate',
      safety_guidance: 'Ensure foam does not enter eyes. Use whipped cream if child mouths items.',
      supervision_guidance: 'Direct caregiver presence and towel on hand.',
      status: 'published',
      created_at: '2026-08-01T00:00:00Z',
      updated_at: '2026-08-01T00:00:00Z',
    },
  ];

  public homePrograms: HomeProgram[] = [
    {
      id: 'hp100000-0000-0000-0000-000000000001',
      clinic_id: 'a0000000-0000-0000-0000-000000000001',
      child_id: 'c1000000-0000-0000-0000-000000000001',
      therapist_id: 'u1000000-0000-0000-0000-000000000001',
      title: 'Aarav - October Fine Motor & Self-Care Home Routine',
      notes_for_caregiver: 'Dear Meera, please aim for 10-15 minutes of playful practice 4 days a week. Praise effort rather than perfection!',
      status: 'published',
      start_date: '2026-10-01',
      end_date: '2026-10-31',
      published_at: '2026-10-01T10:00:00Z',
      created_at: '2026-10-01T09:30:00Z',
      updated_at: '2026-10-01T10:00:00Z',
    },
  ];

  public homeProgramItems: HomeProgramItem[] = [
    {
      id: 'hpi00000-0000-0000-0000-000000000001',
      home_program_id: 'hp100000-0000-0000-0000-000000000001',
      activity_id: 'act00000-0000-0000-0000-000000000001',
      linked_goal_id: 'g1000000-0000-0000-0000-000000000001',
      snapshot_title: 'Clothespin Color Match',
      snapshot_instructions: 'Pinch wooden pins using tip of thumb and index finger only. Clip matching colors around wheel.',
      snapshot_materials: '6 wooden clothespins, colored cardboard circle.',
      prescribed_frequency: '4 times per week',
      prescribed_duration_minutes: 10,
      special_caregiver_notes: 'Encourage Aarav to rest his wrist on the table while pinching.',
      display_order: 1,
      created_at: '2026-10-01T10:00:00Z',
    },
    {
      id: 'hpi00000-0000-0000-0000-000000000002',
      home_program_id: 'hp100000-0000-0000-0000-000000000001',
      activity_id: 'act00000-0000-0000-0000-000000000006',
      linked_goal_id: 'g1000000-0000-0000-0000-000000000002',
      snapshot_title: 'Button Snake Practice',
      snapshot_instructions: 'Tilt button sideways and thread felt circles one by one onto the ribbon.',
      snapshot_materials: 'Button snake practice ribbon with felt shapes.',
      prescribed_frequency: '3 times per week',
      prescribed_duration_minutes: 10,
      special_caregiver_notes: 'Celebrate each felt piece he slides through!',
      display_order: 2,
      created_at: '2026-10-01T10:00:00Z',
    },
  ];

  public activityCompletions: ActivityCompletion[] = [
    {
      id: 'cmp00000-0000-0000-0000-000000000001',
      home_program_item_id: 'hpi00000-0000-0000-0000-000000000001',
      caregiver_id: 'cg100000-0000-0000-0000-000000000001',
      completion_date: '2026-10-02',
      status: 'completed',
      difficulty_experienced: 'just_right',
      child_engagement: 'enthusiastic',
      assistance_needed: 'minimal_help',
      caregiver_observations: 'Aarav enjoyed matching colors. He needed help holding the cardboard still with his left hand.',
      idempotency_key: 'idem-demo-001',
      created_at: '2026-10-02T16:30:00Z',
    },
    {
      id: 'cmp00000-0000-0000-0000-000000000002',
      home_program_item_id: 'hpi00000-0000-0000-0000-000000000002',
      caregiver_id: 'cg100000-0000-0000-0000-000000000001',
      completion_date: '2026-10-04',
      status: 'completed',
      difficulty_experienced: 'challenging',
      child_engagement: 'cooperative',
      assistance_needed: 'minimal_help',
      caregiver_observations: 'Managed 5 felt squares. Thumb got slightly tired toward the end, took a 1 minute rest.',
      idempotency_key: 'idem-demo-002',
      created_at: '2026-10-04T17:15:00Z',
    },
    {
      id: 'cmp00000-0000-0000-0000-000000000003',
      home_program_item_id: 'hpi00000-0000-0000-0000-000000000001',
      caregiver_id: 'cg100000-0000-0000-0000-000000000001',
      completion_date: '2026-10-08',
      status: 'completed',
      difficulty_experienced: 'just_right',
      child_engagement: 'enthusiastic',
      assistance_needed: 'independent',
      caregiver_observations: 'Did all 6 pins without help today! Big proud smile.',
      idempotency_key: 'idem-demo-003',
      created_at: '2026-10-08T18:00:00Z',
    },
  ];

  public sessions: Session[] = [
    {
      id: 'ses10000-0000-0000-0000-000000000001',
      clinic_id: 'a0000000-0000-0000-0000-000000000001',
      child_id: 'c1000000-0000-0000-0000-000000000001',
      therapist_id: 'u1000000-0000-0000-0000-000000000001',
      session_date: '2026-09-29',
      duration_minutes: 45,
      status: 'completed',
      objective_observations: 'Child arrived alert and cooperative. Engaged in warm-up bear walks for 5 minutes. Transitioned to table-top clothespin pinching and pre-writing pencil strokes.',
      assistance_level: 'Minimal verbal cues; physical prompt for distal pencil grip.',
      intervention_response: 'Maintained dynamic tripod grasp for 3 minutes and 10 seconds before reverting to quadrupod. No complaint of hand fatigue.',
      plan_for_next_session: 'Introduce button snake in clinic and progress to uniform shirt practice.',
      created_at: '2026-09-29T11:30:00Z',
      updated_at: '2026-09-29T11:30:00Z',
    },
  ];

  public assessmentTemplates: AssessmentTemplate[] = [
    {
      id: 'tmpl0000-0000-0000-0000-000000000001',
      title: 'Pediatric OT Comprehensive Functional Baseline',
      category: 'Initial Evaluation',
      description: 'Clinic standard baseline assessment evaluating fine motor, sensory processing, bilateral coordination, and ADL functional independence.',
      is_active: true,
      created_at: '2026-08-01T00:00:00Z',
    },
  ];

  public assessments: Assessment[] = [
    {
      id: 'as100000-0000-0000-0000-000000000001',
      clinic_id: 'a0000000-0000-0000-0000-000000000001',
      child_id: 'c1000000-0000-0000-0000-000000000001',
      therapist_id: 'u1000000-0000-0000-0000-000000000001',
      template_version_id: 'tmpl0000-0000-0000-0000-000000000001',
      status: 'finalized',
      assessment_date: '2026-09-01',
      clinical_interpretation: 'Aarav demonstrates mild-to-moderate fine motor coordination delays and reduced intrinsic hand strength affecting pencil grip and fastening skills. Functional potential is high with playful, consistent home practice.',
      next_review_date: '2026-11-01',
      finalized_at: '2026-09-01T12:00:00Z',
      created_at: '2026-09-01T09:00:00Z',
      updated_at: '2026-09-01T12:00:00Z',
    },
  ];

  public reports: Report[] = [
    {
      id: 'rep10000-0000-0000-0000-000000000001',
      clinic_id: 'a0000000-0000-0000-0000-000000000001',
      child_id: 'c1000000-0000-0000-0000-000000000001',
      author_id: 'u1000000-0000-0000-0000-000000000001',
      title: 'Aarav Sundaram - Baseline Assessment & Initial Care Plan',
      report_type: 'initial_assessment',
      period_start: '2026-09-01',
      period_end: '2026-09-30',
      clinical_narrative: 'Patient presented with static pronate grasp and dressing difficulties. Over the first month of therapy and home practice, pencil endurance increased from 60 seconds to 190 seconds with emerging dynamic tripod grasp. Caregiver adherence to home activities is commendable (100% of assigned sessions logged).',
      parent_accessible: true,
      created_at: '2026-10-01T14:00:00Z',
    },
  ];

  public auditEvents: AuditEvent[] = [
    {
      id: 'aud10000-0000-0000-0000-000000000001',
      clinic_id: 'a0000000-0000-0000-0000-000000000001',
      actor_id: 'u1000000-0000-0000-0000-000000000001',
      actor_role: 'clinic_owner',
      action: 'CLINIC_INITIALIZED',
      entity_type: 'clinics',
      entity_id: 'a0000000-0000-0000-0000-000000000001',
      metadata: { name: 'Lotus Pediatric Therapy Center' },
      created_at: '2026-08-01T09:00:00Z',
    },
    {
      id: 'aud10000-0000-0000-0000-000000000002',
      clinic_id: 'a0000000-0000-0000-0000-000000000001',
      actor_id: 'u1000000-0000-0000-0000-000000000001',
      actor_role: 'occupational_therapist',
      action: 'HOME_PROGRAM_PUBLISHED',
      entity_type: 'home_programs',
      entity_id: 'hp100000-0000-0000-0000-000000000001',
      metadata: { child: 'Aarav Sundaram', items: 2 },
      created_at: '2026-10-01T10:00:00Z',
    },
  ];

  // ==========================================
  // QUERY & MUTATION METHODS WITH ISOLATION
  // ==========================================

  public getDashboardMetrics(clinicId: UUID): ClinicDashboardSummary {
    const clinicChildren = this.children.filter((c) => c.clinic_id === clinicId && c.status === 'active');
    const childIds = new Set(clinicChildren.map((c) => c.id));
    const activePrograms = this.homePrograms.filter((hp) => hp.clinic_id === clinicId && hp.status === 'published');
    
    // Recent submissions from caregivers for this clinic
    const clinicItems = this.homeProgramItems.filter((i) => {
      const prog = this.homePrograms.find((hp) => hp.id === i.home_program_id);
      return prog && prog.clinic_id === clinicId;
    });
    const itemIds = new Set(clinicItems.map((i) => i.id));
    const recentSubmissions = this.activityCompletions.filter((ac) => itemIds.has(ac.home_program_item_id)).length;

    // Goals due for review
    const now = new Date('2026-10-10');
    const goalsDue = this.goals.filter((g) => {
      if (g.clinic_id !== clinicId || g.status !== 'active') return false;
      if (!g.target_review_date) return false;
      const rev = new Date(g.target_review_date);
      const diffDays = (rev.getTime() - now.getTime()) / (1000 * 3600 * 24);
      return diffDays <= 30; // Due within next 30 days
    }).length;

    return {
      active_children_count: clinicChildren.length,
      active_home_programs_count: activePrograms.length,
      upcoming_reviews_count: goalsDue,
      recent_submissions_count: recentSubmissions,
      goals_due_for_review_count: goalsDue,
    };
  }

  public getChildren(clinicId: UUID, search?: string, therapistId?: UUID): Child[] {
    let result = this.children.filter((c) => c.clinic_id === clinicId);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.first_name.toLowerCase().includes(q) ||
          c.last_name.toLowerCase().includes(q) ||
          c.functional_concerns?.toLowerCase().includes(q)
      );
    }
    if (therapistId) {
      result = result.filter((c) => c.assigned_therapist_id === therapistId);
    }
    return result;
  }

  public getChild(childId: UUID, clinicId: UUID): Child | undefined {
    return this.children.find((c) => c.id === childId && c.clinic_id === clinicId);
  }

  public createChild(data: Omit<Child, 'id' | 'created_at' | 'updated_at'>, actorId: UUID): Child {
    const newChild: Child = {
      ...data,
      id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.children.unshift(newChild);
    this.logAudit({
      clinic_id: data.clinic_id,
      actor_id: actorId,
      actor_role: 'occupational_therapist',
      action: 'CHILD_CREATED',
      entity_type: 'children',
      entity_id: newChild.id,
      metadata: { name: `${newChild.first_name} ${newChild.last_name}` },
    });
    return newChild;
  }

  public getGoals(childId: UUID): Goal[] {
    return this.goals.filter((g) => g.child_id === childId);
  }

  public getGoalObservations(goalId: UUID): GoalObservation[] {
    return this.goalObservations
      .filter((obs) => obs.goal_id === goalId)
      .sort((a, b) => new Date(a.observation_date).getTime() - new Date(b.observation_date).getTime());
  }

  public createGoal(data: Omit<Goal, 'id' | 'created_at' | 'updated_at'>, actorId: UUID): Goal {
    const newGoal: Goal = {
      ...data,
      id: `g-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.goals.unshift(newGoal);
    // Add baseline observation if numeric
    if (data.baseline_numeric !== undefined) {
      this.goalObservations.push({
        id: `go-${Date.now()}`,
        goal_id: newGoal.id,
        recorded_by: actorId,
        observation_date: data.start_date,
        source: 'therapist_in_clinic',
        measured_numeric: data.baseline_numeric,
        measured_qualitative: data.baseline_value,
        clinical_notes: 'Initial Goal Baseline',
        created_at: new Date().toISOString(),
      });
    }
    this.logAudit({
      clinic_id: data.clinic_id,
      actor_id: actorId,
      actor_role: 'occupational_therapist',
      action: 'GOAL_CREATED',
      entity_type: 'goals',
      entity_id: newGoal.id,
      metadata: { title: newGoal.title, domain: newGoal.domain },
    });
    return newGoal;
  }

  public addGoalObservation(data: Omit<GoalObservation, 'id' | 'created_at'>, clinicId: UUID, actorId: UUID): GoalObservation {
    const newObs: GoalObservation = {
      ...data,
      id: `go-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
    };
    this.goalObservations.push(newObs);
    this.logAudit({
      clinic_id: clinicId,
      actor_id: actorId,
      actor_role: 'occupational_therapist',
      action: 'GOAL_OBSERVATION_RECORDED',
      entity_type: 'goal_observations',
      entity_id: newObs.id,
      metadata: { goal_id: data.goal_id, numeric: data.measured_numeric },
    });
    return newObs;
  }

  public updateGoalStatus(goalId: UUID, newStatus: Goal['status'], clinicId: UUID, actorId: UUID): Goal | undefined {
    const goal = this.goals.find((g) => g.id === goalId);
    if (!goal) return undefined;
    goal.status = newStatus;
    if (newStatus === 'achieved') {
      goal.achieved_date = new Date().toISOString().split('T')[0];
    }
    goal.updated_at = new Date().toISOString();
    this.logAudit({
      clinic_id: clinicId,
      actor_id: actorId,
      actor_role: 'occupational_therapist',
      action: 'GOAL_STATUS_CHANGED',
      entity_type: 'goals',
      entity_id: goal.id,
      metadata: { newStatus },
    });
    return goal;
  }

  public getActivities(clinicId: UUID, category?: string, search?: string): Activity[] {
    let list = this.activities.filter((a) => a.clinic_id === undefined || a.clinic_id === clinicId);
    if (category && category !== 'all') {
      list = list.filter((a) => a.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }
    return list;
  }

  public createActivity(data: Omit<Activity, 'id' | 'created_at' | 'updated_at'>, actorId: UUID): Activity {
    const newAct: Activity = {
      ...data,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.activities.unshift(newAct);
    if (data.clinic_id) {
      this.logAudit({
        clinic_id: data.clinic_id,
        actor_id: actorId,
        actor_role: 'occupational_therapist',
        action: 'ACTIVITY_CREATED',
        entity_type: 'activities',
        entity_id: newAct.id,
        metadata: { title: newAct.title },
      });
    }
    return newAct;
  }

  public getHomePrograms(childId: UUID): (HomeProgram & { items: HomeProgramItem[] })[] {
    const progs = this.homePrograms.filter((hp) => hp.child_id === childId);
    return progs.map((hp) => ({
      ...hp,
      items: this.homeProgramItems.filter((item) => item.home_program_id === hp.id),
    }));
  }

  public createHomeProgram(
    progData: Omit<HomeProgram, 'id' | 'created_at' | 'updated_at' | 'status'>,
    itemsData: Array<{
      activity_id?: UUID;
      linked_goal_id?: UUID;
      snapshot_title: string;
      snapshot_instructions: string;
      snapshot_materials?: string;
      prescribed_frequency: string;
      prescribed_duration_minutes: number;
      special_caregiver_notes?: string;
    }>,
    actorId: UUID
  ): HomeProgram {
    const newProg: HomeProgram = {
      ...progData,
      id: `hp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.homePrograms.unshift(newProg);

    itemsData.forEach((item, idx) => {
      this.homeProgramItems.push({
        ...item,
        id: `hpi-${Date.now()}-${idx}`,
        home_program_id: newProg.id,
        display_order: idx + 1,
        created_at: new Date().toISOString(),
      });
    });

    this.logAudit({
      clinic_id: progData.clinic_id,
      actor_id: actorId,
      actor_role: 'occupational_therapist',
      action: 'HOME_PROGRAM_CREATED_DRAFT',
      entity_type: 'home_programs',
      entity_id: newProg.id,
      metadata: { title: newProg.title, itemCount: itemsData.length },
    });

    return newProg;
  }

  public publishHomeProgram(programId: UUID, actorId: UUID): HomeProgram | undefined {
    const prog = this.homePrograms.find((hp) => hp.id === programId);
    if (!prog) return undefined;
    prog.status = 'published';
    prog.published_at = new Date().toISOString();
    prog.updated_at = new Date().toISOString();

    this.logAudit({
      clinic_id: prog.clinic_id,
      actor_id: actorId,
      actor_role: 'occupational_therapist',
      action: 'HOME_PROGRAM_PUBLISHED',
      entity_type: 'home_programs',
      entity_id: prog.id,
      metadata: { title: prog.title },
    });

    return prog;
  }

  public getCaregiverCompletions(childId: UUID): (ActivityCompletion & { itemTitle: string })[] {
    const progs = this.homePrograms.filter((hp) => hp.child_id === childId);
    const progIds = new Set(progs.map((hp) => hp.id));
    const items = this.homeProgramItems.filter((i) => progIds.has(i.home_program_id));
    const itemMap = new Map(items.map((i) => [i.id, i.snapshot_title]));

    return this.activityCompletions
      .filter((ac) => itemMap.has(ac.home_program_item_id))
      .map((ac) => ({
        ...ac,
        itemTitle: itemMap.get(ac.home_program_item_id) || 'Activity',
      }))
      .sort((a, b) => new Date(b.completion_date).getTime() - new Date(a.completion_date).getTime());
  }

  public logActivityCompletion(data: Omit<ActivityCompletion, 'id' | 'created_at'>): ActivityCompletion {
    // Idempotency check
    if (data.idempotency_key) {
      const existing = this.activityCompletions.find((ac) => ac.idempotency_key === data.idempotency_key);
      if (existing) return existing;
    }

    const newCompletion: ActivityCompletion = {
      ...data,
      id: `cmp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
    };
    this.activityCompletions.unshift(newCompletion);
    return newCompletion;
  }

  public getSessions(childId: UUID): Session[] {
    return this.sessions
      .filter((s) => s.child_id === childId)
      .sort((a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime());
  }

  public createSession(data: Omit<Session, 'id' | 'created_at' | 'updated_at'>, actorId: UUID): Session {
    const newSession: Session = {
      ...data,
      id: `ses-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.sessions.unshift(newSession);
    this.logAudit({
      clinic_id: data.clinic_id,
      actor_id: actorId,
      actor_role: 'occupational_therapist',
      action: 'SESSION_DOCUMENTED',
      entity_type: 'sessions',
      entity_id: newSession.id,
      metadata: { session_date: data.session_date, child_id: data.child_id },
    });
    return newSession;
  }

  public getAssessments(childId: UUID): Assessment[] {
    return this.assessments
      .filter((a) => a.child_id === childId)
      .sort((a, b) => new Date(b.assessment_date).getTime() - new Date(a.assessment_date).getTime());
  }

  public finalizeAssessment(assessmentId: UUID, clinicalInterpretation: string, nextReviewDate: string, clinicId: UUID, actorId: UUID): Assessment | undefined {
    const ass = this.assessments.find((a) => a.id === assessmentId);
    if (!ass) return undefined;
    ass.status = 'finalized';
    ass.clinical_interpretation = clinicalInterpretation;
    ass.next_review_date = nextReviewDate;
    ass.finalized_at = new Date().toISOString();
    ass.updated_at = new Date().toISOString();

    this.logAudit({
      clinic_id: clinicId,
      actor_id: actorId,
      actor_role: 'occupational_therapist',
      action: 'ASSESSMENT_FINALIZED',
      entity_type: 'assessments',
      entity_id: ass.id,
      metadata: { child_id: ass.child_id },
    });

    return ass;
  }

  public getReports(childId: UUID): Report[] {
    return this.reports
      .filter((r) => r.child_id === childId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public createReport(data: Omit<Report, 'id' | 'created_at'>, actorId: UUID): Report {
    const newReport: Report = {
      ...data,
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
    };
    this.reports.unshift(newReport);
    this.logAudit({
      clinic_id: data.clinic_id,
      actor_id: actorId,
      actor_role: 'occupational_therapist',
      action: 'REPORT_GENERATED',
      entity_type: 'reports',
      entity_id: newReport.id,
      metadata: { title: newReport.title, type: newReport.report_type },
    });
    return newReport;
  }

  public getAuditEvents(clinicId: UUID): AuditEvent[] {
    return this.auditEvents
      .filter((e) => e.clinic_id === clinicId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  private logAudit(data: Omit<AuditEvent, 'id' | 'created_at'>) {
    this.auditEvents.unshift({
      ...data,
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
    });
  }
}

// Global Singleton Instance
export const db = new ClinicalDataStore();
