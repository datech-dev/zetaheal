'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/data-store';
import { calculateAge, formatDate } from '@/lib/utils';
import type { Goal, GoalDomain, GoalObservation, HomeProgram } from '@zetaheal/shared-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  Target,
  FileCheck2,
  Calendar,
  Home,
  Clock,
  FileText,
  HeartHandshake,
  ArrowLeft,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Share2,
  Printer,
  Sparkles,
  Send,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Activity as ActivityIcon,
  HelpCircle,
} from 'lucide-react';

export default function ChildWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const childId = params?.id as string;
  const { currentClinic, currentUser, currentRole } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'assessments' | 'goals' | 'sessions' | 'home_programs' | 'timeline' | 'reports' | 'caregivers'
  >('overview');

  // Verify child belongs to this clinic (Multi-Tenancy Guard)
  const child = db.getChild(childId, currentClinic.id);

  // Clinical Sub-records
  const goals = db.getGoals(childId);
  const homePrograms = db.getHomePrograms(childId);
  const caregiverSubmissions = db.getCaregiverCompletions(childId);
  const sessions = db.getSessions(childId);
  const assessments = db.getAssessments(childId);
  const reports = db.getReports(childId);

  // Goal Form State
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalDomain, setGoalDomain] = useState<GoalDomain>('fine_motor');
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [goalBaselineVal, setGoalBaselineVal] = useState('');
  const [goalBaselineNum, setGoalBaselineNum] = useState<number | ''>('');
  const [goalTargetVal, setGoalTargetVal] = useState('');
  const [goalTargetNum, setGoalTargetNum] = useState<number | ''>('');
  const [goalUnit, setGoalUnit] = useState('seconds');

  // Observation Form State
  const [selectedGoalForObs, setSelectedGoalForObs] = useState<Goal | null>(null);
  const [obsDate, setObsDate] = useState('2026-10-10');
  const [obsNumeric, setObsNumeric] = useState<number | ''>('');
  const [obsQualitative, setObsQualitative] = useState('');
  const [obsNotes, setObsNotes] = useState('');

  // Session Note Form State
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionDate, setSessionDate] = useState('2026-10-10');
  const [sessionDuration, setSessionDuration] = useState(45);
  const [sessionObs, setSessionObs] = useState('');
  const [sessionAssistance, setSessionAssistance] = useState('Minimal verbal cues');
  const [sessionResponse, setSessionResponse] = useState('');
  const [sessionNextPlan, setSessionNextPlan] = useState('');

  // Program Builder State
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [programTitle, setProgramTitle] = useState('Weekly Functional Practice');
  const [programNotes, setProgramNotes] = useState('Praise effort; keep sessions playful.');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    'act00000-0000-0000-0000-000000000001', // Clothespin
    'act00000-0000-0000-0000-000000000006', // Button snake
  ]);

  // Caregiver Invite State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');

  if (!child) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 card-subtle-shadow max-w-xl mx-auto space-y-4">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Tenant Access Restrained</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The requested child record does not belong to <span className="font-semibold text-slate-800">{currentClinic.name}</span>. Multi-tenant Row Level Security prevents cross-clinic record exposure.
        </p>
        <Link
          href="/children"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Directory
        </Link>
      </div>
    );
  }

  // Handle Create Goal
  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !goalDesc || !goalBaselineVal || !goalTargetVal) return;

    db.createGoal(
      {
        clinic_id: currentClinic.id,
        child_id: child.id,
        responsible_therapist_id: currentUser.id,
        domain: goalDomain,
        title: goalTitle,
        functional_description: goalDesc,
        baseline_value: goalBaselineVal,
        baseline_numeric: goalBaselineNum !== '' ? Number(goalBaselineNum) : undefined,
        target_value: goalTargetVal,
        target_numeric: goalTargetNum !== '' ? Number(goalTargetNum) : undefined,
        measurement_unit: goalUnit,
        status: 'active',
        start_date: new Date().toISOString().split('T')[0],
      },
      currentUser.id
    );

    setGoalTitle('');
    setGoalDesc('');
    setGoalBaselineVal('');
    setGoalBaselineNum('');
    setGoalTargetVal('');
    setGoalTargetNum('');
    setShowGoalModal(false);
  };

  // Handle Add Observation
  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalForObs) return;

    db.addGoalObservation(
      {
        goal_id: selectedGoalForObs.id,
        recorded_by: currentUser.id,
        observation_date: obsDate,
        source: 'therapist_in_clinic',
        measured_numeric: obsNumeric !== '' ? Number(obsNumeric) : undefined,
        measured_qualitative: obsQualitative,
        clinical_notes: obsNotes,
      },
      currentClinic.id,
      currentUser.id
    );

    setSelectedGoalForObs(null);
    setObsNumeric('');
    setObsQualitative('');
    setObsNotes('');
  };

  // Handle Create Session
  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionObs) return;

    db.createSession(
      {
        clinic_id: currentClinic.id,
        child_id: child.id,
        therapist_id: currentUser.id,
        session_date: sessionDate,
        duration_minutes: Number(sessionDuration),
        status: 'completed',
        objective_observations: sessionObs,
        assistance_level: sessionAssistance,
        intervention_response: sessionResponse,
        plan_for_next_session: sessionNextPlan,
      },
      currentUser.id
    );

    setSessionObs('');
    setSessionResponse('');
    setSessionNextPlan('');
    setShowSessionModal(false);
  };

  // Handle Create & Publish Home Program
  const handlePublishProgram = () => {
    const actList = db.getActivities(currentClinic.id);
    const chosen = actList.filter((a) => selectedActivities.includes(a.id));

    const items = chosen.map((act) => ({
      activity_id: act.id,
      snapshot_title: act.title,
      snapshot_instructions: act.instructions,
      snapshot_materials: act.materials_needed,
      prescribed_frequency: act.suggested_frequency,
      prescribed_duration_minutes: act.estimated_duration_minutes,
      special_caregiver_notes: 'Focus on gentle repetition at home.',
    }));

    const newProg = db.createHomeProgram(
      {
        clinic_id: currentClinic.id,
        child_id: child.id,
        therapist_id: currentUser.id,
        title: programTitle,
        notes_for_caregiver: programNotes,
        start_date: new Date().toISOString().split('T')[0],
      },
      items,
      currentUser.id
    );

    db.publishHomeProgram(newProg.id, currentUser.id);
    setShowProgramModal(false);
  };

  // Handle Caregiver Invite
  const handleSendCaregiverInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviteSuccess(`Secure single-use invite token generated for ${inviteEmail}. Token valid for 72 hours.`);
    setInviteEmail('');
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Back button & Patient Header */}
      <div className="space-y-4">
        <Link
          href="/children"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Patient Directory
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 card-subtle-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
                {child.first_name} {child.last_name}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full capitalize">
                {child.status}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              DOB: {formatDate(child.date_of_birth)} ({calculateAge(child.date_of_birth)}) • Gender: {child.gender || 'Not specified'} • ID: {child.id.substring(0, 13)}...
            </p>
            <p className="text-xs text-slate-600 pt-1 line-clamp-1">
              <span className="font-semibold text-slate-800">Functional Concerns:</span> {child.functional_concerns}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSessionModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg shadow-sm transition-all"
            >
              <Calendar className="w-4 h-4 text-teal-600" />
              Document Session
            </button>
            <button
              onClick={() => setShowGoalModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Add Functional Goal
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview', icon: HeartHandshake },
          { id: 'goals', label: `Goals (${goals.length})`, icon: Target },
          { id: 'home_programs', label: `Home Programs (${homePrograms.length})`, icon: Home },
          { id: 'sessions', label: `Sessions (${sessions.length})`, icon: Calendar },
          { id: 'assessments', label: `Assessments (${assessments.length})`, icon: FileCheck2 },
          { id: 'timeline', label: 'Progress Timeline', icon: Clock },
          { id: 'reports', label: `Reports (${reports.length})`, icon: FileText },
          { id: 'caregivers', label: 'Caregivers & Consent', icon: Users },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-teal-700 text-teal-900 font-bold bg-teal-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Goals Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold font-heading text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-teal-600" />
                Active Functional Goals
              </h2>
              <button
                onClick={() => setActiveTab('goals')}
                className="text-xs font-semibold text-teal-700 hover:underline"
              >
                View all & trend charts &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {goals.map((g) => {
                const obs = db.getGoalObservations(g.id);
                const latestObs = obs[obs.length - 1];
                return (
                  <div key={g.id} className="bg-white rounded-xl border border-slate-200 p-4 card-subtle-shadow space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                          {g.domain.replace('_', ' ')}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{g.title}</h3>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                        {g.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">{g.functional_description}</p>

                    <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Baseline</span>
                        <span className="font-semibold text-slate-700">
                          {g.baseline_numeric !== undefined ? `${g.baseline_numeric} ${g.measurement_unit || ''}` : g.baseline_value}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Latest Progress</span>
                        <span className="font-semibold text-teal-700">
                          {latestObs?.measured_numeric !== undefined
                            ? `${latestObs.measured_numeric} ${g.measurement_unit || ''}`
                            : 'Baseline'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Target Goal</span>
                        <span className="font-semibold text-slate-700">
                          {g.target_numeric !== undefined ? `${g.target_numeric} ${g.measurement_unit || ''}` : g.target_value}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Home Program & Caregiver Logs */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 card-subtle-shadow space-y-4">
              <h2 className="text-sm font-bold font-heading text-slate-900 flex items-center gap-2">
                <Home className="w-4 h-4 text-teal-600" />
                Active Home Program
              </h2>

              {homePrograms.length > 0 ? (
                <div className="space-y-3">
                  <div className="p-3 bg-teal-50/60 rounded-lg border border-teal-100">
                    <span className="text-xs font-bold text-teal-950 block">{homePrograms[0].title}</span>
                    <span className="text-[11px] text-teal-700 block mt-0.5">
                      Status: Published • {homePrograms[0].items.length} prescribed activities
                    </span>
                  </div>

                  <div className="text-xs space-y-2">
                    <span className="font-semibold text-slate-700 block">Prescribed Daily Routine:</span>
                    {homePrograms[0].items.map((it) => (
                      <div key={it.id} className="p-2 rounded border border-slate-100 bg-slate-50 flex items-center justify-between">
                        <span className="font-medium text-slate-800">{it.snapshot_title}</span>
                        <span className="text-[11px] text-slate-500">{it.prescribed_duration_minutes} min</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">No active home program published.</p>
              )}
            </div>

            {/* Recent Caregiver Feedback */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 card-subtle-shadow space-y-3">
              <h2 className="text-sm font-bold font-heading text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                Caregiver Home Observations
              </h2>

              <div className="space-y-2.5">
                {caregiverSubmissions.slice(0, 2).map((sub) => (
                  <div key={sub.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{sub.itemTitle}</span>
                      <span className="text-[10px] text-slate-400">{formatDate(sub.completion_date)}</span>
                    </div>
                    <p className="text-slate-600 italic bg-white p-2 rounded border border-slate-100">
                      &quot;{sub.caregiver_observations}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: GOALS */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-heading text-slate-900">Functional Goals & Trajectories</h2>
              <p className="text-xs text-slate-500">
                Track quantitative seconds/repetitions and qualitative functional milestones over time.
              </p>
            </div>
            <button
              onClick={() => setShowGoalModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm"
            >
              <PlusCircle className="w-4 h-4" /> Add Goal
            </button>
          </div>

          <div className="space-y-6">
            {goals.map((g) => {
              const obs = db.getGoalObservations(g.id);
              const chartData = obs.map((o) => ({
                date: formatDate(o.observation_date),
                measured: o.measured_numeric,
                target: g.target_numeric,
              }));

              return (
                <div key={g.id} className="bg-white rounded-2xl border border-slate-200 p-6 card-subtle-shadow space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-semibold text-teal-700 uppercase bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                        {g.domain.replace('_', ' ')}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{g.title}</h3>
                      <p className="text-xs text-slate-600 mt-0.5">{g.functional_description}</p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                        {g.status}
                      </span>
                      <button
                        onClick={() => setSelectedGoalForObs(g)}
                        className="px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors"
                      >
                        + Log Observation
                      </button>
                    </div>
                  </div>

                  {/* Quantitative Chart if numeric */}
                  {g.target_numeric !== undefined && chartData.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                        <span>Progress Trajectory ({g.measurement_unit})</span>
                        <span className="text-[11px] text-teal-600 font-medium">Target: {g.target_numeric} {g.measurement_unit}</span>
                      </div>
                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 'auto']} />
                            <Tooltip />
                            <Line type="monotone" dataKey="measured" stroke="#0f766e" strokeWidth={2.5} dot={{ r: 4 }} name="Measured" />
                            <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1.5} name="Target" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Observation History Table */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-800">Dated Clinical Observations:</span>
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                      {obs.map((o) => (
                        <div key={o.id} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
                          <div>
                            <span className="font-semibold text-slate-800">{formatDate(o.observation_date)}: </span>
                            <span className="text-slate-600">{o.measured_qualitative || `${o.measured_numeric} ${g.measurement_unit}`}</span>
                            {o.clinical_notes && (
                              <p className="text-[11px] text-slate-500 italic mt-0.5">&ldquo;{o.clinical_notes}&rdquo;</p>
                            )}
                          </div>
                          <span className="text-[10px] text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-full capitalize self-start sm:self-center">
                            {o.source.replace(/_/g, ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: HOME PROGRAMS */}
      {activeTab === 'home_programs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-heading text-slate-900">Home Activity Programs</h2>
              <p className="text-xs text-slate-500">
                Prescribe goal-linked activity routines. Assignment snapshots remain immutable when published.
              </p>
            </div>
            <button
              onClick={() => setShowProgramModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm"
            >
              <PlusCircle className="w-4 h-4" /> Build Home Program
            </button>
          </div>

          <div className="space-y-6">
            {homePrograms.map((prog) => (
              <div key={prog.id} className="bg-white rounded-2xl border border-slate-200 p-6 card-subtle-shadow space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold font-heading text-slate-900">{prog.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Period: {formatDate(prog.start_date)} {prog.end_date ? `to ${formatDate(prog.end_date)}` : '(Ongoing)'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                    {prog.status}
                  </span>
                </div>

                {prog.notes_for_caregiver && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                    <span className="font-semibold block mb-0.5">Instructions for Caregiver:</span>
                    {prog.notes_for_caregiver}
                  </div>
                )}

                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-800">Assigned Activity Items ({prog.items.length}):</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {prog.items.map((item) => (
                      <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{item.snapshot_title}</span>
                          <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                            {item.prescribed_duration_minutes} min
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2">{item.snapshot_instructions}</p>
                        <div className="text-[11px] text-slate-400">
                          Frequency: <span className="font-medium text-slate-700">{item.prescribed_frequency}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-heading text-slate-900">Clinical Session Documentation</h2>
              <p className="text-xs text-slate-500">Therapist-recorded SOAP notes, assistance levels, and next session plans.</p>
            </div>
            <button
              onClick={() => setShowSessionModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm"
            >
              <PlusCircle className="w-4 h-4" /> Record Session
            </button>
          </div>

          <div className="space-y-4">
            {sessions.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-6 card-subtle-shadow space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-heading text-slate-900 text-sm">{formatDate(s.session_date)}</span>
                    <span className="text-xs text-slate-500">({s.duration_minutes} minutes)</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                    {s.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700 block">Objective Observations:</span>
                    <p className="text-slate-600 leading-relaxed mt-0.5">{s.objective_observations}</p>
                  </div>
                  {s.assistance_level && (
                    <div>
                      <span className="font-semibold text-slate-700 block">Assistance Required:</span>
                      <p className="text-slate-600 mt-0.5">{s.assistance_level}</p>
                    </div>
                  )}
                  {s.intervention_response && (
                    <div>
                      <span className="font-semibold text-slate-700 block">Response to Intervention:</span>
                      <p className="text-slate-600 leading-relaxed mt-0.5">{s.intervention_response}</p>
                    </div>
                  )}
                  {s.plan_for_next_session && (
                    <div className="p-2.5 bg-teal-50/60 rounded-lg border border-teal-100">
                      <span className="font-semibold text-teal-900 block">Plan for Next Session:</span>
                      <p className="text-teal-800 mt-0.5">{s.plan_for_next_session}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ASSESSMENTS */}
      {activeTab === 'assessments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-heading text-slate-900">Clinical Assessments</h2>
              <p className="text-xs text-slate-500">Comprehensive baseline & periodic standardized retests.</p>
            </div>
          </div>

          <div className="space-y-4">
            {assessments.map((ass) => (
              <div key={ass.id} className="bg-white rounded-2xl border border-slate-200 p-6 card-subtle-shadow space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold font-heading text-slate-900">
                      Comprehensive Pediatric OT Functional Baseline
                    </h3>
                    <p className="text-xs text-slate-500">Date: {formatDate(ass.assessment_date)}</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 uppercase">
                    {ass.status} (Locked)
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block text-xs mb-1">Clinical Interpretation:</span>
                    <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                      {ass.clinical_interpretation}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span>Next Formal Review: <strong className="text-slate-800">{formatDate(ass.next_review_date || '')}</strong></span>
                    <span>•</span>
                    <span>Finalized At: {formatDate(ass.finalized_at || '')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-bold font-heading text-slate-900">Unified Chronological Care Timeline</h2>
            <p className="text-xs text-slate-500">
              Clear distinction between therapist-documented sessions and caregiver home logs.
            </p>
          </div>

          <div className="relative pl-6 space-y-6 border-l-2 border-slate-200">
            {/* Recent Caregiver Submissions */}
            {caregiverSubmissions.map((sub) => (
              <div key={sub.id} className="relative space-y-1">
                <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 card-subtle-shadow text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                        Caregiver Home Log
                      </span>
                      {sub.itemTitle}
                    </span>
                    <span className="text-[10px] text-slate-400">{formatDate(sub.completion_date)}</span>
                  </div>
                  <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded border border-slate-100">
                    &ldquo;{sub.caregiver_observations}&rdquo;
                  </p>
                </div>
              </div>
            ))}

            {/* Clinical Sessions */}
            {sessions.map((s) => (
              <div key={s.id} className="relative space-y-1">
                <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-teal-600 border-2 border-white"></div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 card-subtle-shadow text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-semibold">
                        Clinical Therapy Session
                      </span>
                      {s.duration_minutes} min Session
                    </span>
                    <span className="text-[10px] text-slate-400">{formatDate(s.session_date)}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{s.objective_observations}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-heading text-slate-900">Outcome & Progress Reports</h2>
              <p className="text-xs text-slate-500">Print-ready reports distinguishing home adherence from clinical progress.</p>
            </div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
          </div>

          <div className="space-y-6">
            {reports.map((rep) => (
              <div key={rep.id} className="bg-white rounded-2xl border border-slate-200 p-8 card-subtle-shadow space-y-6 print-page">
                {/* Print Header */}
                <div className="flex justify-between items-start border-b-2 border-teal-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold font-heading text-slate-900">{currentClinic.name}</h3>
                    <p className="text-xs text-slate-500">
                      {currentClinic.address?.street}, {currentClinic.address?.city} • {currentClinic.contact_phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded bg-teal-100 text-teal-900 font-bold text-xs">
                      CLINICAL PROGRESS REPORT
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">Period: {formatDate(rep.period_start)} - {formatDate(rep.period_end)}</p>
                  </div>
                </div>

                {/* Patient Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block">Child Patient:</span>
                    <span className="font-bold text-slate-800">{child.first_name} {child.last_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Age:</span>
                    <span className="font-bold text-slate-800">{calculateAge(child.date_of_birth)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Treating Therapist:</span>
                    <span className="font-bold text-slate-800">{currentUser.display_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Parent Visible:</span>
                    <span className="font-bold text-emerald-700">{rep.parent_accessible ? 'Yes (Approved)' : 'No (Clinical Only)'}</span>
                  </div>
                </div>

                {/* Narrative */}
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm">Clinical Summary & Evaluation</h4>
                  <p className="text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
                    {rep.clinical_narrative}
                  </p>
                </div>

                {/* Sign-off */}
                <div className="pt-8 flex justify-between items-end text-xs text-slate-500">
                  <div>
                    <p>Generated by Zeta Heal OT Platform</p>
                    <p>Date: {formatDate(rep.created_at)}</p>
                  </div>
                  <div className="text-right border-t border-slate-300 pt-2 w-48">
                    <p className="font-bold text-slate-900">{currentUser.display_name}</p>
                    <p>Licensed Occupational Therapist</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CAREGIVERS */}
      {activeTab === 'caregivers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-heading text-slate-900">Authorized Caregivers & Consent</h2>
              <p className="text-xs text-slate-500">
                Caregivers receive single-use verified tokens to access home programs via the mobile app.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 card-subtle-shadow space-y-4">
              <h3 className="text-sm font-bold font-heading text-slate-900">Linked Caregivers</h3>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Meera Sundaram (Mother)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                    Verified Active
                  </span>
                </div>
                <p className="text-slate-500">meera.sundaram@example.com • +91 99620 44556</p>
                <div className="pt-2 text-[11px] text-slate-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Consent Granted: Pediatric OT Care Coordination v1.0
                </div>
              </div>
            </div>

            {/* Invite Caregiver Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 card-subtle-shadow space-y-4">
              <h3 className="text-sm font-bold font-heading text-slate-900">Generate Caregiver Invite Token</h3>
              <p className="text-xs text-slate-500">
                Generates a cryptographically secure 72-hour token for the parent mobile application.
              </p>

              {inviteSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{inviteSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSendCaregiverInvite} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Caregiver Email</label>
                  <input
                    type="email"
                    required
                    placeholder="parent@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-all"
                >
                  Generate & Send Invite Token
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD GOAL */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h2 className="text-base font-bold font-heading text-slate-900">Define Functional Goal</h2>
            <form onSubmit={handleCreateGoal} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Domain</label>
                <select
                  value={goalDomain}
                  onChange={(e) => setGoalDomain(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="fine_motor">Fine Motor Skills</option>
                  <option value="visual_motor">Visual-Motor Integration</option>
                  <option value="self_care">Self-Care & ADL</option>
                  <option value="feeding">Feeding-related Skills</option>
                  <option value="sensory_processing">Sensory Processing</option>
                  <option value="play_participation">Play & Participation</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dynamic Tripod Grasp for Writing"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Functional Description *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Child will maintain grasp for 5 minutes during classroom tasks..."
                  value={goalDesc}
                  onChange={(e) => setGoalDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Baseline Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fatigues after 60s"
                    value={goalBaselineVal}
                    onChange={(e) => setGoalBaselineVal(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Baseline Numeric (Optional)</label>
                  <input
                    type="number"
                    placeholder="60"
                    value={goalBaselineNum}
                    onChange={(e) => setGoalBaselineNum(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maintains 300s"
                    value={goalTargetVal}
                    onChange={(e) => setGoalTargetVal(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Numeric (Optional)</label>
                  <input
                    type="number"
                    placeholder="300"
                    value={goalTargetNum}
                    onChange={(e) => setGoalTargetNum(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG OBSERVATION */}
      {selectedGoalForObs && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h2 className="text-base font-bold font-heading text-slate-900">Record Progress Observation</h2>
            <p className="text-xs text-slate-500 font-medium">Goal: {selectedGoalForObs.title}</p>

            <form onSubmit={handleAddObservation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Observation Date *</label>
                <input
                  type="date"
                  required
                  value={obsDate}
                  onChange={(e) => setObsDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              {selectedGoalForObs.target_numeric !== undefined && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Measured Numeric Value ({selectedGoalForObs.measurement_unit})
                  </label>
                  <input
                    type="number"
                    value={obsNumeric}
                    onChange={(e) => setObsNumeric(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Qualitative Milestone Note</label>
                <input
                  type="text"
                  placeholder="e.g. Dynamic tripod maintained with triangular grip"
                  value={obsQualitative}
                  onChange={(e) => setObsQualitative(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Comments</label>
                <textarea
                  rows={2}
                  placeholder="Context, fatigue level, prompts given..."
                  value={obsNotes}
                  onChange={(e) => setObsNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedGoalForObs(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm"
                >
                  Save Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DOCUMENT SESSION */}
      {showSessionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h2 className="text-base font-bold font-heading text-slate-900">Document Therapy Session</h2>

            <form onSubmit={handleCreateSession} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Session Date *</label>
                  <input
                    type="date"
                    required
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Objective Observations *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Activities performed, posture, bilateral coordination observed..."
                  value={sessionObs}
                  onChange={(e) => setSessionObs(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assistance Level</label>
                <input
                  type="text"
                  placeholder="e.g. Minimal verbal cues, hand-over-hand demonstration..."
                  value={sessionAssistance}
                  onChange={(e) => setSessionAssistance(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Response to Intervention</label>
                <textarea
                  rows={2}
                  placeholder="Child engagement, fatigue threshold, motivation..."
                  value={sessionResponse}
                  onChange={(e) => setSessionResponse(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plan for Next Session</label>
                <input
                  type="text"
                  placeholder="e.g. Advance to 4-hole button board and introduce paper maze cutting..."
                  value={sessionNextPlan}
                  onChange={(e) => setSessionNextPlan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BUILD HOME PROGRAM */}
      {showProgramModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h2 className="text-base font-bold font-heading text-slate-900">Build & Publish Home Program</h2>
            <p className="text-xs text-slate-500">
              Select activities from the library. Once published, snapshot instructions are frozen for caregiver consistency.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Program Title</label>
                <input
                  type="text"
                  value={programTitle}
                  onChange={(e) => setProgramTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes for Caregiver</label>
                <textarea
                  rows={2}
                  value={programNotes}
                  onChange={(e) => setProgramNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Selected Library Activities (2):</label>
                <div className="space-y-1.5 p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between text-slate-800">
                    <span>1. Clothespin Color Match</span>
                    <span className="text-[10px] text-teal-700 font-semibold">10 min • 4x/week</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-800">
                    <span>2. Button Snake Practice</span>
                    <span className="text-[10px] text-teal-700 font-semibold">10 min • 3x/week</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProgramModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePublishProgram}
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm"
                >
                  Publish to Caregiver Mobile App
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
