import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { translations, Locale } from './src/i18n/translations';
import { mobileStorage } from './src/services/storage';

interface AssignedActivity {
  id: string;
  title: string;
  instructions: string;
  materials: string;
  duration: number;
  frequency: string;
  safety: string;
  status: 'pending' | 'completed';
}

export default function App() {
  const [locale, setLocale] = useState<Locale>('en');
  const [activeTab, setActiveTab] = useState<'home' | 'progress' | 'settings'>('home');
  const t = translations[locale];

  // Activities State
  const [activities, setActivities] = useState<AssignedActivity[]>([
    {
      id: 'hpi-1',
      title: 'Clothespin Color Match',
      instructions:
        '1. Seat child at table with elbows at 90 degrees.\n2. Provide 6 wooden clothespins and color wheel.\n3. Coach child to pinch the pin using pads of thumb and index finger (pincer grasp), avoiding whole-hand grasping.\n4. Clip each pin to its matching color sector.',
      materials: '6 wooden clothespins, sturdy colored cardboard circle.',
      duration: 10,
      frequency: '4 times per week',
      safety: 'Watch for pinching soft skin; ensure wooden pins do not have splinters. Direct parent supervision.',
      status: 'completed',
    },
    {
      id: 'hpi-2',
      title: 'Button Snake Practice',
      instructions:
        '1. Child holds felt shape with one hand.\n2. With the other hand, tilts the button sideways and pushes it through the felt slit.\n3. Pulls shape down to the end of the ribbon.\n4. Repeat for 5-6 shapes.',
      materials: 'Ribbon with 1-inch button sewn on one end, felt squares with slits.',
      duration: 10,
      frequency: '3 times per week',
      safety: 'Ensure button is securely stitched to avoid detachment. Celebrate each felt piece!',
      status: 'pending',
    },
  ]);

  // Modals
  const [selectedActivity, setSelectedActivity] = useState<AssignedActivity | null>(null);
  const [isLoggingModalVisible, setIsLoggingModalVisible] = useState(false);

  // Completion Form State
  const [completionStatus, setCompletionStatus] = useState<'completed' | 'partially_completed' | 'not_completed'>('completed');
  const [difficulty, setDifficulty] = useState<'easy' | 'just_right' | 'challenging' | 'frustrating'>('just_right');
  const [engagement, setEngagement] = useState<'enthusiastic' | 'cooperative' | 'reluctant' | 'refused'>('enthusiastic');
  const [observations, setObservations] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  const completedCount = activities.filter((a) => a.status === 'completed').length;

  const handleSubmitLog = () => {
    if (!selectedActivity) return;

    // Update state & idempotency key
    const idempotencyKey = mobileStorage.generateIdempotencyKey();
    setActivities((prev) =>
      prev.map((a) => (a.id === selectedActivity.id ? { ...a, status: 'completed' } : a))
    );

    setIsLoggingModalVisible(false);
    setSubmitMessage(t.logSubmittedSuccess);
    setObservations('');

    setTimeout(() => {
      setSubmitMessage('');
    }, 4000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f766e" />

      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t.appTitle}</Text>
          <Text style={styles.headerSubtitle}>{t.childSubtitle}</Text>
        </View>

        {/* Locale Toggle */}
        <TouchableOpacity
          style={styles.langButton}
          onPress={() => setLocale(locale === 'en' ? 'ta' : 'en')}
        >
          <Text style={styles.langButtonText}>{locale === 'en' ? 'தமிழ்' : 'English'}</Text>
        </TouchableOpacity>
      </View>

      {/* Success Banner */}
      {submitMessage ? (
        <View style={styles.successBanner}>
          <Text style={styles.successBannerText}>{submitMessage}</Text>
        </View>
      ) : null}

      {/* Main Tab Views */}
      <ScrollView style={styles.contentContainer}>
        {activeTab === 'home' && (
          <View style={styles.tabContent}>
            {/* Therapist Note Banner */}
            <View style={styles.noteCard}>
              <Text style={styles.noteHeader}>{t.therapistNoteHeader}</Text>
              <Text style={styles.noteBody}>
                &ldquo;Dear Meera, Aarav is showing great stamina with clothespins! Aim for 10 minutes of gentle button snake play today.&rdquo;
              </Text>
            </View>

            {/* Daily Practice Counter */}
            <View style={styles.counterCard}>
              <View>
                <Text style={styles.counterLabel}>{t.todaysActivities}</Text>
                <Text style={styles.counterSub}>
                  {completedCount} of {activities.length} completed
                </Text>
              </View>
              <View style={styles.counterBadge}>
                <Text style={styles.counterBadgeText}>
                  {Math.round((completedCount / activities.length) * 100)}%
                </Text>
              </View>
            </View>

            {/* Assigned Activities List */}
            <Text style={styles.sectionHeader}>{t.pendingPractice}</Text>
            {activities.map((act) => {
              const isDone = act.status === 'completed';
              return (
                <View key={act.id} style={[styles.activityCard, isDone && styles.activityCardDone]}>
                  <View style={styles.activityHeaderRow}>
                    <Text style={styles.activityTitle}>{act.title}</Text>
                    <View style={[styles.statusBadge, isDone ? styles.badgeDone : styles.badgePending]}>
                      <Text style={[styles.statusBadgeText, isDone ? styles.badgeTextDone : styles.badgeTextPending]}>
                        {isDone ? 'Completed' : 'Ready'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.activityMeta}>
                    {act.duration} min • {act.frequency}
                  </Text>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() => setSelectedActivity(act)}
                    >
                      <Text style={styles.detailsButtonText}>{t.viewDetails}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.logButton, isDone && styles.logButtonDisabled]}
                      onPress={() => {
                        setSelectedActivity(act);
                        setIsLoggingModalVisible(true);
                      }}
                    >
                      <Text style={styles.logButtonText}>
                        {isDone ? 'Practice Logged' : t.markCompleted}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {activeTab === 'progress' && (
          <View style={styles.tabContent}>
            <View style={styles.counterCard}>
              <View>
                <Text style={styles.counterLabel}>Home Practice Streak</Text>
                <Text style={styles.counterSub}>4 consecutive days logged</Text>
              </View>
              <Text style={styles.fireEmoji}>⭐</Text>
            </View>

            <Text style={styles.sectionHeader}>{t.approvedMilestones}</Text>
            <View style={styles.milestoneCard}>
              <Text style={styles.milestoneTitle}>Pencil & Utensil Grasp</Text>
              <Text style={styles.milestoneDesc}>
                Maintains dynamic tripod grip for 3+ minutes during coloring.
              </Text>
              <Text style={styles.milestoneDate}>Reviewed by Dr. Priya on Oct 1, 2026</Text>
            </View>

            <View style={styles.milestoneCard}>
              <Text style={styles.milestoneTitle}>Shirt Buttoning</Text>
              <Text style={styles.milestoneDesc}>
                Independently threads 2 buttons through felt slits with verbal encouragement.
              </Text>
              <Text style={styles.milestoneDate}>Reviewed on Sept 22, 2026</Text>
            </View>

            <View style={styles.disclaimerBox}>
              <Text style={styles.disclaimerText}>{t.disclaimer}</Text>
            </View>
          </View>
        )}

        {activeTab === 'settings' && (
          <View style={styles.tabContent}>
            <View style={styles.settingCard}>
              <Text style={styles.settingTitle}>Child Profile</Text>
              <Text style={styles.settingValue}>Aarav Sundaram (Age 6)</Text>
              <Text style={styles.settingSub}>Clinic: Lotus Pediatric Therapy Center</Text>
            </View>

            <View style={styles.settingCard}>
              <Text style={styles.settingTitle}>Consent Record</Text>
              <Text style={styles.settingValue}>Active v1.0 • Verified Caregiver</Text>
              <Text style={styles.settingSub}>Token SHA-256 authenticated</Text>
            </View>

            <View style={styles.settingCard}>
              <Text style={styles.settingTitle}>Reminders</Text>
              <Text style={styles.settingValue}>Daily at 5:00 PM</Text>
              <Text style={styles.settingSub}>Push notifications active</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Activity Detail Modal */}
      {selectedActivity && !isLoggingModalVisible && (
        <Modal animationType="slide" transparent visible={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedActivity.title}</Text>

              <ScrollView style={styles.modalScroll}>
                <Text style={styles.modalSectionTitle}>{t.instructions}</Text>
                <Text style={styles.modalText}>{selectedActivity.instructions}</Text>

                <Text style={styles.modalSectionTitle}>{t.materials}</Text>
                <Text style={styles.modalText}>{selectedActivity.materials}</Text>

                <Text style={styles.modalSectionTitle}>{t.safetyGuidance}</Text>
                <Text style={styles.modalText}>{selectedActivity.safety}</Text>
              </ScrollView>

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setSelectedActivity(null)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalActionBtn}
                  onPress={() => setIsLoggingModalVisible(true)}
                >
                  <Text style={styles.modalActionText}>{t.markCompleted}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Completion Logging Modal */}
      {isLoggingModalVisible && selectedActivity && (
        <Modal animationType="slide" transparent visible={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t.logCompletionTitle}</Text>
              <Text style={styles.modalSubtitle}>{selectedActivity.title}</Text>

              <ScrollView style={styles.modalScroll}>
                <Text style={styles.inputLabel}>{t.howDidItGo}</Text>
                <View style={styles.optionRow}>
                  <TouchableOpacity
                    style={[styles.optChip, completionStatus === 'completed' && styles.optChipActive]}
                    onPress={() => setCompletionStatus('completed')}
                  >
                    <Text style={[styles.optChipText, completionStatus === 'completed' && styles.optChipTextActive]}>
                      {t.statusCompleted}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.optChip, completionStatus === 'partially_completed' && styles.optChipActive]}
                    onPress={() => setCompletionStatus('partially_completed')}
                  >
                    <Text style={[styles.optChipText, completionStatus === 'partially_completed' && styles.optChipTextActive]}>
                      {t.statusPartial}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>{t.difficultyLabel}</Text>
                <View style={styles.optionRow}>
                  {(['easy', 'just_right', 'challenging', 'frustrating'] as const).map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={[styles.optChip, difficulty === d && styles.optChipActive]}
                      onPress={() => setDifficulty(d)}
                    >
                      <Text style={[styles.optChipText, difficulty === d && styles.optChipTextActive]}>
                        {d === 'easy' ? t.diffEasy : d === 'just_right' ? t.diffJustRight : d === 'challenging' ? t.diffChallenging : t.diffFrustrating}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>{t.engagementLabel}</Text>
                <View style={styles.optionRow}>
                  {(['enthusiastic', 'cooperative', 'reluctant', 'refused'] as const).map((eng) => (
                    <TouchableOpacity
                      key={eng}
                      style={[styles.optChip, engagement === eng && styles.optChipActive]}
                      onPress={() => setEngagement(eng)}
                    >
                      <Text style={[styles.optChipText, engagement === eng && styles.optChipTextActive]}>
                        {eng === 'enthusiastic' ? t.engEnthusiastic : eng === 'cooperative' ? t.engCooperative : eng === 'reluctant' ? t.engReluctant : t.engRefused}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Observations for Dr. Priya</Text>
                <TextInput
                  style={styles.textInput}
                  multiline
                  numberOfLines={3}
                  placeholder={t.observationsPlaceholder}
                  placeholderTextColor="#94a3b8"
                  value={observations}
                  onChangeText={setObservations}
                />
              </ScrollView>

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setIsLoggingModalVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalActionBtn} onPress={handleSubmitLog}>
                  <Text style={styles.modalActionText}>{t.submitLog}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('home')}
        >
          <Text style={[styles.tabText, activeTab === 'home' && styles.tabTextActive]}>
            🎯 {t.homeTab}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('progress')}
        >
          <Text style={[styles.tabText, activeTab === 'progress' && styles.tabTextActive]}>
            📈 {t.progressTab}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.tabText, activeTab === 'settings' && styles.tabTextActive]}>
            ⚙️ {t.settingsTab}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f766e',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#0f766e',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#ccfbf1',
    marginTop: 2,
  },
  langButton: {
    backgroundColor: '#115e59',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2dd4bf',
  },
  langButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  successBanner: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#86efac',
  },
  successBannerText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabContent: {
    padding: 16,
  },
  noteCard: {
    backgroundColor: '#f0fdfa',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#99f6e4',
    marginBottom: 14,
  },
  noteHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f766e',
    marginBottom: 4,
  },
  noteBody: {
    fontSize: 12,
    color: '#134e4a',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  counterCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  counterLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  counterSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  counterBadge: {
    backgroundColor: '#ccfbf1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  counterBadgeText: {
    color: '#0f766e',
    fontWeight: 'bold',
    fontSize: 14,
  },
  fireEmoji: {
    fontSize: 26,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 10,
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activityCardDone: {
    borderColor: '#bbf7d0',
    backgroundColor: '#fbfdfb',
  },
  activityHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgePending: {
    backgroundColor: '#e0f2fe',
  },
  badgeDone: {
    backgroundColor: '#dcfce7',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  badgeTextPending: {
    color: '#0369a1',
  },
  badgeTextDone: {
    color: '#15803d',
  },
  activityMeta: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  logButton: {
    flex: 1,
    backgroundColor: '#0f766e',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  logButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  logButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  milestoneCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  milestoneDesc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
    lineHeight: 18,
  },
  milestoneDate: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 8,
  },
  disclaimerBox: {
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginTop: 10,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 16,
  },
  settingCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  settingTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
  },
  settingValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 2,
  },
  settingSub: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#0f766e',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 10,
  },
  modalScroll: {
    marginVertical: 10,
  },
  modalSectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f766e',
    marginTop: 10,
    marginBottom: 4,
  },
  modalText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 10,
    marginBottom: 6,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  optChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  optChipActive: {
    borderColor: '#0f766e',
    backgroundColor: '#ccfbf1',
  },
  optChipText: {
    fontSize: 11,
    color: '#475569',
  },
  optChipTextActive: {
    color: '#0f766e',
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    textAlignVertical: 'top',
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  modalCloseButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  modalActionBtn: {
    flex: 2,
    backgroundColor: '#0f766e',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalActionText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
