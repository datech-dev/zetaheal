-- ==============================================================================
-- Seed: supabase/seed.sql
-- Description: Comprehensive synthetic demonstration dataset for Zeta Heal
-- Note: Contains strictly fictional synthetic demonstration data for development.
-- ==============================================================================

-- 1. CLINICS
INSERT INTO clinics (id, name, subdomain, contact_email, contact_phone, address, timezone, default_language)
VALUES 
(
    'a0000000-0000-0000-0000-000000000001',
    'Lotus Pediatric Therapy Center',
    'lotus-ot',
    'admin@lotuspediatric.example',
    '+91 44 2499 1234',
    '{"street": "42 Greenways Road, RA Puram", "city": "Chennai", "state": "Tamil Nadu", "postal_code": "600028", "country": "India"}',
    'Asia/Kolkata',
    'en'
),
(
    'b0000000-0000-0000-0000-000000000002',
    'Blossom Child Development Clinic',
    'blossom-cdc',
    'contact@blossomchild.example',
    '+91 80 4123 5678',
    '{"street": "18 Koramangala 4th Block", "city": "Bengaluru", "state": "Karnataka", "postal_code": "560034", "country": "India"}',
    'Asia/Kolkata',
    'en'
);

-- 2. USER PROFILES
INSERT INTO user_profiles (id, display_name, email, phone_number, language_preference)
VALUES 
-- Lotus Clinic Staff
('u1000000-0000-0000-0000-000000000001', 'Dr. Priya Sharma, MOT, OTR', 'priya.sharma@lotuspediatric.example', '+91 98400 11223', 'en'),
('u1000000-0000-0000-0000-000000000002', 'Ananya Krishnan, BOT', 'ananya.k@lotuspediatric.example', '+91 98400 22334', 'en'),
-- Blossom Clinic Staff
('u2000000-0000-0000-0000-000000000001', 'Rajesh Raman, MOT', 'rajesh.r@blossomchild.example', '+91 98400 33445', 'en'),
-- Caregivers
('u3000000-0000-0000-0000-000000000001', 'Meera Sundaram (Mother)', 'meera.sundaram@example.com', '+91 99620 44556', 'en'),
('u3000000-0000-0000-0000-000000000002', 'Karthik Venkatesh (Father)', 'karthik.v@example.com', '+91 99620 55667', 'ta');

-- 3. CLINIC MEMBERSHIPS
INSERT INTO clinic_memberships (clinic_id, user_id, role, status)
VALUES
('a0000000-0000-0000-0000-000000000001', 'u1000000-0000-0000-0000-000000000001', 'clinic_owner', 'active'),
('a0000000-0000-0000-0000-000000000001', 'u1000000-0000-0000-0000-000000000002', 'occupational_therapist', 'active'),
('b0000000-0000-0000-0000-000000000002', 'u2000000-0000-0000-0000-000000000001', 'clinic_owner', 'active');

-- 4. CHILDREN (Synthetic Patients)
INSERT INTO children (id, clinic_id, first_name, last_name, date_of_birth, gender, clinical_history, functionalConcerns, assigned_therapist_id, status)
VALUES
(
    'c1000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Aarav',
    'Sundaram',
    '2020-04-15',
    'male',
    'Referred by pediatrician for fine motor delays, difficulties with tripod pencil grasp, and fatigue during handwriting activities.',
    'Difficulty holding utensils, fatigues quickly during coloring, struggles to fasten buttons independently.',
    'u1000000-0000-0000-0000-000000000001',
    'active'
),
(
    'c1000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'Diya',
    'Venkatesh',
    '2022-09-08',
    'female',
    'Sensory processing differences, tactile defensiveness with messy textures, seeking proprioceptive input through repetitive jumping.',
    'Aversion to finger painting/textures, difficulty settling for bedtime, needs frequent proprioceptive breaks during play.',
    'u1000000-0000-0000-0000-000000000002',
    'active'
),
(
    'c2000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000002',
    'Vihaan',
    'Patel',
    '2021-02-20',
    'male',
    'Bilateral coordination challenges and difficulties with motor planning for school-readiness tasks.',
    'Difficulty with scissor cutting and stabilizing paper with non-dominant hand.',
    'u2000000-0000-0000-0000-000000000001',
    'active'
);

-- 5. CAREGIVERS & LINKS
INSERT INTO caregivers (id, user_id, email, phone_number, preferred_contact_method)
VALUES
('cg100000-0000-0000-0000-000000000001', 'u3000000-0000-0000-0000-000000000001', 'meera.sundaram@example.com', '+91 99620 44556', 'email'),
('cg100000-0000-0000-0000-000000000002', 'u3000000-0000-0000-0000-000000000002', 'karthik.v@example.com', '+91 99620 55667', 'sms');

INSERT INTO child_caregivers (child_id, caregiver_id, relationship, status, can_view_progress)
VALUES
('c1000000-0000-0000-0000-000000000001', 'cg100000-0000-0000-0000-000000000001', 'mother', 'active', true),
('c1000000-0000-0000-0000-000000000002', 'cg100000-0000-0000-0000-000000000002', 'father', 'active', true);

INSERT INTO consent_records (child_id, caregiver_id, purpose, status, version)
VALUES
('c1000000-0000-0000-0000-000000000001', 'cg100000-0000-0000-0000-000000000001', 'pediatric_ot_care_coordination_and_home_program', 'granted', '1.0'),
('c1000000-0000-0000-0000-000000000002', 'cg100000-0000-0000-0000-000000000002', 'pediatric_ot_care_coordination_and_home_program', 'granted', '1.0');

-- 6. 20 CURATED PEDIATRIC OT ACTIVITIES (GLOBAL LIBRARY)
INSERT INTO activities (id, title, category, description, instructions, functional_purpose, materials_needed, estimated_duration_minutes, suggested_frequency, difficulty_level, safety_guidance, supervisionGuidance, status)
VALUES
(
    'act00000-0000-0000-0000-000000000001',
    'Clothespin Color Match',
    'Fine Motor Skills',
    'Using wooden spring clothespins to pinch and match colored paper cards around a circular cardboard rim.',
    '1. Seat child at a table with elbows at 90 degrees. 2. Provide 6 colored clothespins and a matching color wheel. 3. Coach child to pinch the pin using pads of thumb and index finger (pincer grasp), avoiding whole-hand grasping. 4. Clip each pin to its matching color sector.',
    'Builds intrinsic hand muscle strength and strengthens dynamic 2-point pincer grasp required for pencil control and utensil use.',
    '6 wooden spring clothespins, sturdy cardboard circle colored into 6 sectors (Red, Blue, Green, Yellow, Orange, Purple).',
    10,
    '4 times per week',
    'moderate',
    'Watch for pinching soft skin; ensure wooden pins do not have splinters.',
    'Direct parent supervision during pinching.',
    'published'
),
(
    'act00000-0000-0000-0000-000000000002',
    'Playdough Finger Pinch & Meatball Roll',
    'Fine Motor Skills',
    'Rolling therapeutic playdough into small spheres ("meatballs") using finger pads and pinching them flat.',
    '1. Break off a small piece of dough (grape-sized). 2. Instruct child to roll it into a ball using only index, middle finger and thumb. 3. Once round, pinch it flat using the thumb and index finger tips.',
    'Develops radial finger isolation, arches of the hand, and graded fingertip force control.',
    'Non-toxic playdough or sensory putty.',
    15,
    'Daily',
    'easy',
    'Non-toxic dough only. Keep away from mouths for younger children.',
    'Caregiver guided demonstration.',
    'published'
),
(
    'act00000-0000-0000-0000-000000000003',
    'Lacing Bead Tower',
    'Bilateral Coordination',
    'Threading wooden beads onto a tipped lace while stabilizing the string with the non-dominant hand.',
    '1. Child holds lace in non-dominant hand. 2. Uses dominant hand to pick up bead with pincer grasp. 3. Guides lace through the bead hole and pulls through to form a pattern.',
    'Enhances bimanual coordination, eye-hand alignment, and midline crossing.',
    'Large wooden beads (1.5 inch), tipped shoelace or thick yarn with tape tip.',
    15,
    '3 times per week',
    'moderate',
    'Choking hazard: use beads larger than 1.25 inches for children under 5.',
    'Supervised table activity.',
    'published'
),
(
    'act00000-0000-0000-0000-000000000004',
    'Scissor Maze Trail',
    'Visual-Motor Integration',
    'Cutting along straight and curved lines on heavy paper to guide a character to a finish line.',
    '1. Ensure proper scissor grip: thumb in top loop pointing up, middle/ring in bottom loop, index finger supporting outside. 2. Non-dominant hand holds and rotates the paper while dominant hand snips along the bold line.',
    'Develops helper hand paper rotation, distal scissor control, and visual tracking along a path.',
    'Child safety scissors (blunt tip), printed maze paths on heavy cardstock.',
    12,
    '3 times per week',
    'moderate',
    'Safety scissors only. Keep non-cutting fingers behind the scissor blade.',
    'Direct 1-on-1 parent supervision.',
    'published'
),
(
    'act00000-0000-0000-0000-000000000005',
    'Animal Walk Safari Obstacle Course',
    'Gross Motor & Proprioceptive',
    'Imitating animal movements across the living room carpet (Bear crawl, Crab walk, Frog jumps).',
    '1. Bear Walk: Hands and feet on ground with hips raised, walk 10 feet. 2. Crab Walk: Hands and feet behind back, belly up. 3. Frog Jump: Deep squat to jump forward.',
    'Delivers heavy work (proprioceptive input) to shoulders, core, and hips to promote joint stability and sensory regulation.',
    'Open floor space or carpet, small cushions as stepping markers.',
    15,
    'Daily before sit-down tasks',
    'moderate',
    'Clear obstacles and sharp furniture corners before starting.',
    'Adult enthusiastic participation and pacing.',
    'published'
),
(
    'act00000-0000-0000-0000-000000000006',
    'Button Snake Practice',
    'Self-Care (ADL)',
    'Pushing felt shapes with buttonholes along a ribbon with a large button sewn to the end.',
    '1. Child holds felt shape with one hand. 2. With the other hand, tilts the button sideways and pushes it through the felt slit. 3. Pulls shape down to the end of the ribbon.',
    'Direct functional practice for fastening buttons on shirts and jackets without garment frustration.',
    'Ribbon with a 1-inch wooden or plastic button sewn on one end, 8-10 felt squares with slits.',
    10,
    '4 times per week',
    'moderate',
    'Ensure button is securely stitched to avoid detachment.',
    'Caregiver encouraging stepwise independence.',
    'published'
),
(
    'act00000-0000-0000-0000-000000000007',
    'Tweezer Pom-Pom Color Sort',
    'Fine Motor Skills',
    'Using child plastic tweezers to transfer soft craft pom-poms into an ice cube tray by color.',
    '1. Hold tweezers with thumb on one side and index/middle on opposite side. 2. Squeeze to pick up a pom-pom. 3. Maintain sustained squeeze while moving to target compartment.',
    'Improves web space opening, hand separation, and sustained motor endurance for writing.',
    'Child training tweezers, multi-colored craft pom-poms (1 inch), empty ice cube tray.',
    12,
    '4 times per week',
    'easy',
    'Keep small pom-poms away from toddlers.',
    'Supervised play.',
    'published'
),
(
    'act00000-0000-0000-0000-000000000008',
    'Shaving Cream Pre-Writing Tracing',
    'Sensory & Handwriting Readiness',
    'Spreading non-menthol shaving cream or whipped cream on a plastic tray and drawing pre-writing shapes (lines, circles, crosses).',
    '1. Spread thin layer of foam over tray. 2. Therapist/parent demonstrates drawing a vertical line (|), horizontal line (-), and cross (+). 3. Child uses pointer finger to imitate, feeling the tactile resistance.',
    'Desensitizes tactile hypersensitivity while reinforcing pre-writing strokes through multi-sensory feedback.',
    'Baking sheet or plastic tray, hypoallergenic shaving foam or edible whipped topping.',
    15,
    '2 times per week',
    'moderate',
    'Ensure foam does not enter child eyes. Use whipped cream if child mouths items.',
    'Direct caregiver presence and towel on hand.',
    'published'
),
(
    'act00000-0000-0000-0000-000000000009',
    'Sensory Cushion Balance Path',
    'Vestibular & Balance',
    'Walking heel-to-toe along a sequence of firm couch cushions placed on the floor.',
    '1. Line up 4 couch cushions end-to-end on a rug. 2. Child walks slowly across the uneven surface with arms outstretched like airplane wings. 3. Count steps together.',
    'Stimulates vestibular and balance reactions, strengthening core stability and dynamic equilibrium.',
    '3-4 firm sofa cushions or pillows placed on carpet.',
    10,
    'Daily',
    'easy',
    'Avoid placing near glass tables or sharp corners.',
    'Stand close to catch any slips.',
    'published'
),
(
    'act00000-0000-0000-0000-000000000010',
    'Zipper & Snap Dressing Board',
    'Self-Care (ADL)',
    'Practicing hooking zipper bottoms, sliding pull tabs, and snapping heavy snap fasteners on a practice board.',
    '1. Practice aligning bottom zipper pin into the retainer box. 2. Hold garment taut with non-dominant hand while pulling zipper tab upward with dominant pincer grasp.',
    'Mastering fastener mechanics needed for morning dressing routines.',
    'Old jacket mounted to a cardboard board or specialized busy board.',
    10,
    '3 times per week',
    'moderate',
    'Be careful not to catch skin in zipper teeth.',
    'Assisted practice.',
    'published'
),
(
    'act00000-0000-0000-0000-000000000011',
    'Straw Rocket Breath Control',
    'Oral-Motor & Self-Regulation',
    'Blowing through a drinking straw to launch a paper rocket across the kitchen table.',
    '1. Roll a small paper slip around a pencil, tape the top closed to make a rocket cap. 2. Slip onto the end of a straw. 3. Child takes a deep breath and blows hard through the straw.',
    'Engages abdominal core muscles, promotes deep respiratory regulation, and aids calming/focus before seatwork.',
    'Paper straw, scrap paper, tape, scissors.',
    10,
    'Daily as calming routine',
    'easy',
    'Use paper straws rather than hard plastics where possible.',
    'Supervised play.',
    'published'
),
(
    'act00000-0000-0000-0000-000000000012',
    'Chopstick Sponge Transfer',
    'Fine Motor Skills',
    'Using joined training chopsticks to pick up cut kitchen sponges from one bowl and drop them into another.',
    '1. Place two bowls side by side. 2. Child holds training chopsticks with rubber band hinge. 3. Squeezes sponge cube, lifts, and releases into the adjacent bowl.',
    'Develops dissociation of thumb side from ring/pinky side of the hand.',
    'Training chopsticks or standard chopsticks connected with a folded paper wedge and rubber band, dry sponge cubes.',
    15,
    '3 times per week',
    'challenging',
    'Keep sponges dry to prevent mildew.',
    'Caregiver guidance.',
    'published'
),
(
    'act00000-0000-0000-0000-000000000013',
    'Mirror Emotion Imitation Game',
    'Social & Motor Planning',
    'Looking into a mirror with caregiver and making distinct expressive faces (Surprised, Happy, Focused, Silly).',
    '1. Stand together in front of bathroom mirror. 2. Caregiver makes an exaggerated expression. 3. Child imitates, noticing eyebrow elevation, cheek movement, and smile symmetry.',
    'Facilitates body scheme awareness, facial motor control, and emotional social connection.',
    'Safe wall mirror or handheld mirror.',
    10,
    'Daily',
    'easy',
    'Ensure mirror is securely mounted or shatterproof.',
    'Warm, playful caregiver engagement.',
    'published'
),
(
    'act00000-0000-0000-0000-000000000014',
    'Dot Marker Pattern Copy',
    'Visual-Motor Integration',
    'Using bingo dot dabbers to reproduce a sequence of dots (e.g. Red-Blue-Red-Blue) on paper.',
    '1. Provide child with 2-3 colors of washable dot markers. 2. Show sample pattern on top of page. 3. Child presses marker firmly down on paper beneath to duplicate sequence.',
    'Develops visual discrimination, vertical arm alignment, and graded downward force.',
    'Washable dot dabber markers, blank paper sheets.',
    15,
    '3 times per week',
    'easy',
    'Washable markers only.',
    'Table supervision.',
    'published'
),
(
    'act00000-0000-0000-0000-000000000015',
    'Shoe Tying Step Ladder',
    'Self-Care (ADL)',
    'Practicing the cross-over knot and bunny-ears method on a two-toned shoelace model.',
    '1. Cross laces to make an X. 2. Tuck top lace under and pull tight. 3. Make two bunny ear loops. 4. Cross ears, tuck one through the hole, and pull both ears snug.',
    'Teaches complex sequential motor planning for shoe management.',
    'Practice shoe board or clean sneaker with two different colored laces (helps visual distinction).',
    15,
    '4 times per week',
    'challenging',
    'Do not allow children to trip over untied laces during movement.',
    'Step-by-step adult demonstration.',
    'published'
),
(
    'act00000-0000-0000-0000-000000000016',
    'Clay Alphabet Letter Stamping',
    'Handwriting Readiness',
    'Rolling flat slabs of modeling clay and pressing alphabet stamps or wooden blocks to form target letters.',
    '1. Roll clay flat using a small rolling pin (bilateral bilateral arm movement). 2. Press letter stamps with steady downward pressure. 3. Trace the indented letter with index finger.',
    'Builds letter orientation memory and sensory impression of stroke formation before pencil-on-paper work.',
    'Modeling clay, plastic letter stamps or wooden alphabet blocks, rolling pin.',
    15,
    '3 times per week',
    'moderate',
    'Keep clay away from carpets.',
    'Caregiver guided.',
    'published'
),
(
    'act00000-0000-0000-0000-000000000017',
    'Heavy Work Laundry Basket Push',
    'Sensory / Proprioceptive',
    'Pushing a weighted laundry basket filled with books or folded blankets across the hallway.',
    '1. Place 3-4 heavy blankets or soft toys in plastic laundry basket. 2. Child pushes basket with both hands while keeping back straight and legs pushing.',
    'Provides proprioceptive deep pressure to calm an over-aroused nervous system and increase bodily awareness.',
    'Sturdy plastic laundry basket, blankets or cushions.',
    10,
    'Daily before bedtime or school',
    'easy',
    'Avoid excessively heavy weights; basket should slide smoothly without straining spine.',
    'Adult direction and clear path.',
    'published'
),
(
    'act00000-0000-0000-0000-000000000018',
    'Spoon-to-Bowl Water Transfer',
    'Feeding & Motor Control',
    'Using a soup spoon to transfer colored water from one shallow dish to an empty dish without spilling.',
    '1. Fill one dish with 1/2 cup tinted water. 2. Child holds spoon with mature utensil grasp. 3. Carefully scoops, lifts, carries across, and empties into second dish.',
    'Refines forearm supination, wrist stability, and smooth rate of movement necessary for independent spoon feeding.',
    'Two shallow bowls, soup spoon, water with a drop of food coloring, absorbent tray.',
    12,
    '3 times per week',
    'moderate',
    'Use non-breakable plastic bowls.',
    'Supervised kitchen table play.',
    'published'
),
(
    'act00000-0000-0000-0000-000000000019',
    'Paper Plate Ring Toss',
    'Visual-Motor Integration',
    'Tossing cut paper plate rings over a cardboard paper towel roll taped to the floor.',
    '1. Cut centers out of 4 paper plates to make rings. 2. Tape paper towel tube standing upright 4 feet away. 3. Child throws rings using controlled underhand release.',
    'Improves motor planning, distance estimation, and upper extremity coordination.',
    'Cardboard paper towel core, masking tape, 4 paper plates.',
    15,
    '3 times per week',
    'easy',
    'Ensure floor is free of slipping hazards.',
    'Enthusiastic family turn-taking.',
    'published'
),
(
    'act00000-0000-0000-0000-000000000020',
    'Bimanual Balloon Volleyball',
    'Bilateral Coordination & Timing',
    'Keeping a floating balloon in the air using both hands together or alternating hands without letting it touch the ground.',
    '1. Inflate a brightly colored balloon. 2. Count aloud how many consecutive taps child can achieve using both palms.',
    'Promotes upward gaze visual tracking, rapid motor adjustments, and bilateral timing in a low-gravity, low-frustration setting.',
    '9-inch latex balloon.',
    12,
    'Daily active play',
    'easy',
    'Keep uninflated or popped balloons away from toddlers (choking hazard).',
    'Caregiver active playmate.',
    'published'
);

-- 7. FUNCTIONAL GOALS FOR AARAV & DIYA
INSERT INTO goals (id, clinic_id, child_id, responsible_therapist_id, domain, title, functional_description, baseline_value, baseline_numeric, target_value, target_numeric, measurement_unit, status, start_date, target_review_date, notes)
VALUES
(
    'g1000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'u1000000-0000-0000-0000-000000000001',
    'fine_motor',
    'Dynamic Tripod Grasp on Writing Utensils',
    'Aarav will maintain a dynamic tripod grasp with open web space while writing or coloring for 5 continuous minutes without hand cramping.',
    'Uses static digital pronate grasp; fatigues after 60 seconds.',
    60,
    'Maintains dynamic tripod grasp for 300 seconds (5 min).',
    300,
    'seconds',
    'active',
    '2026-09-01',
    '2026-11-01',
    'Baseline established during initial OT assessment. Shows good interest in colored markers.'
),
(
    'g1000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'u1000000-0000-0000-0000-000000000001',
    'self_care',
    'Independent Shirt Buttoning (Medium Buttons)',
    'Aarav will independently button a 4-button school uniform shirt within 2 minutes with no more than 1 verbal prompt.',
    'Requires full physical assistance to line up and push buttons.',
    0,
    'Fastens all 4 buttons independently.',
    4,
    'buttons fastened',
    'active',
    '2026-09-01',
    '2026-11-15',
    'Button Snake home activity assigned to reinforce finger isolation.'
),
(
    'g1000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000002',
    'u1000000-0000-0000-0000-000000000002',
    'sensory_processing',
    'Tolerance of Tactile Textures during Craft Play',
    'Diya will tolerate touching textured art media (finger paint, shaving foam) for 10 minutes without signs of sensory distress or hand-wiping.',
    'Withdraws hands immediately upon contact with wet media (< 15 seconds).',
    15,
    'Participates in textured sensory play for 600 seconds (10 min).',
    600,
    'seconds',
    'active',
    '2026-09-10',
    '2026-11-20',
    'Gradual desensitization protocol in place; starting with shaving cream in zip-top bag, advancing to open tray.'
);

-- 8. GOAL OBSERVATIONS (HISTORICAL DATA POINTS)
INSERT INTO goal_observations (goal_id, recorded_by, observation_date, source, measured_numeric, measured_qualitative, clinical_notes)
VALUES
('g1000000-0000-0000-0000-000000000001', 'u1000000-0000-0000-0000-000000000001', '2026-09-01', 'therapist_in_clinic', 60, 'Static pronate grasp', 'Initial clinical evaluation baseline.'),
('g1000000-0000-0000-0000-000000000001', 'u1000000-0000-0000-0000-000000000001', '2026-09-15', 'therapist_in_clinic', 120, 'Transitional quadrupod grasp with slight wrist flexion', 'Progress noted after clothespin therapy activities.'),
('g1000000-0000-0000-0000-000000000001', 'u1000000-0000-0000-0000-000000000001', '2026-09-29', 'therapist_in_clinic', 190, 'Dynamic tripod emerging; maintained for over 3 minutes', 'Demonstrates open web space with triangular pencil grip.'),
('g1000000-0000-0000-0000-000000000002', 'u1000000-0000-0000-0000-000000000001', '2026-09-01', 'therapist_in_clinic', 0, 'Could not push button through slit', 'Initial baseline.'),
('g1000000-0000-0000-0000-000000000002', 'u1000000-0000-0000-0000-000000000001', '2026-09-22', 'therapist_in_clinic', 2, 'Completed 2 of 4 buttons with verbal cues', 'Improved thumb-index pinch strength.');

-- 9. HOME PROGRAM FOR AARAV (PUBLISHED SNAPSHOT)
INSERT INTO home_programs (id, clinic_id, child_id, therapist_id, title, notes_for_caregiver, status, start_date, end_date, published_at)
VALUES
(
    'hp100000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'u1000000-0000-0000-0000-000000000001',
    'Aarav - October Fine Motor & Self-Care Home Routine',
    'Dear Meera, please aim for 10-15 minutes of playful practice 4 days a week. Praise effort rather than perfection!',
    'published',
    '2026-10-01',
    '2026-10-31',
    '2026-10-01 10:00:00+00'
);

INSERT INTO home_program_items (id, home_program_id, activity_id, linked_goal_id, snapshot_title, snapshot_instructions, snapshot_materials, prescribed_frequency, prescribed_duration_minutes, special_caregiver_notes, display_order)
VALUES
(
    'hpi00000-0000-0000-0000-000000000001',
    'hp100000-0000-0000-0000-000000000001',
    'act00000-0000-0000-0000-000000000001',
    'g1000000-0000-0000-0000-000000000001',
    'Clothespin Color Match',
    'Pinch wooden pins using tip of thumb and index finger only. Clip matching colors around wheel.',
    '6 wooden clothespins, colored cardboard circle.',
    '4 times per week',
    10,
    'Encourage Aarav to rest his wrist on the table while pinching.',
    1
),
(
    'hpi00000-0000-0000-0000-000000000002',
    'hp100000-0000-0000-0000-000000000001',
    'act00000-0000-0000-0000-000000000006',
    'g1000000-0000-0000-0000-000000000002',
    'Button Snake Practice',
    'Tilt button sideways and thread felt circles one by one onto the ribbon.',
    'Button snake practice ribbon with felt shapes.',
    '3 times per week',
    10,
    'Celebrate each felt piece he slides through!',
    2
);

-- 10. CAREGIVER ACTIVITY COMPLETION LOGS
INSERT INTO activity_completions (id, home_program_item_id, caregiver_id, completion_date, status, difficulty_experienced, child_engagement, assistance_needed, caregiver_observations, idempotency_key)
VALUES
(
    'cmp00000-0000-0000-0000-000000000001',
    'hpi00000-0000-0000-0000-000000000001',
    'cg100000-0000-0000-0000-000000000001',
    '2026-10-02',
    'completed',
    'just_right',
    'enthusiastic',
    'minimal_help',
    'Aarav enjoyed matching colors. He needed help holding the cardboard still with his left hand.',
    'idem-demo-001'
),
(
    'cmp00000-0000-0000-0000-000000000002',
    'hpi00000-0000-0000-0000-000000000002',
    'cg100000-0000-0000-0000-000000000001',
    '2026-10-04',
    'completed',
    'challenging',
    'cooperative',
    'minimal_help',
    'Managed 5 felt squares. Thumb got slightly tired toward the end, took a 1 minute rest.',
    'idem-demo-002'
);

-- 11. AUDIT EVENTS
INSERT INTO audit_events (clinic_id, actor_id, actor_role, action, entity_type, entity_id, metadata)
VALUES
('a0000000-0000-0000-0000-000000000001', 'u1000000-0000-0000-0000-000000000001', 'clinic_owner', 'CLINIC_INITIALIZED', 'clinics', 'a0000000-0000-0000-0000-000000000001', '{"name": "Lotus Pediatric Therapy Center"}'),
('a0000000-0000-0000-0000-000000000001', 'u1000000-0000-0000-0000-000000000001', 'occupational_therapist', 'CHILD_CREATED', 'children', 'c1000000-0000-0000-0000-000000000001', '{"name": "Aarav Sundaram"}'),
('a0000000-0000-0000-0000-000000000001', 'u1000000-0000-0000-0000-000000000001', 'occupational_therapist', 'HOME_PROGRAM_PUBLISHED', 'home_programs', 'hp100000-0000-0000-0000-000000000001', '{"title": "Aarav - October Fine Motor & Self-Care Home Routine"}');
