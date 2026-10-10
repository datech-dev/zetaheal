'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/data-store';
import type { Activity } from '@zetaheal/shared-types';
import {
  Compass,
  Search,
  Filter,
  PlusCircle,
  Clock,
  Sparkles,
  ShieldAlert,
  X,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Tag,
} from 'lucide-react';

export default function ActivityLibraryPage() {
  const { currentClinic, currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [previewActivity, setPreviewActivity] = useState<Activity | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Activity Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Fine Motor Skills');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [functionalPurpose, setFunctionalPurpose] = useState('');
  const [materialsNeeded, setMaterialsNeeded] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(15);
  const [suggestedFrequency, setSuggestedFrequency] = useState('3 times per week');
  const [difficulty, setDifficulty] = useState<'easy' | 'moderate' | 'challenging'>('moderate');
  const [safetyGuidance, setSafetyGuidance] = useState('');
  const [supervisionGuidance, setSupervisionGuidance] = useState('');

  // Fetch activities
  const allActivities = db.getActivities(currentClinic.id, selectedCategory, searchTerm);
  const filteredActivities = selectedDifficulty === 'all'
    ? allActivities
    : allActivities.filter((a) => a.difficulty_level.toLowerCase() === selectedDifficulty.toLowerCase());

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !instructions || !functionalPurpose) return;

    db.createActivity(
      {
        clinic_id: currentClinic.id,
        title,
        category,
        description,
        instructions,
        functional_purpose: functionalPurpose,
        materials_needed: materialsNeeded,
        estimated_duration_minutes: Number(estimatedDuration),
        suggested_frequency: suggestedFrequency,
        difficulty_level: difficulty,
        safety_guidance: safetyGuidance,
        supervision_guidance: supervisionGuidance,
        status: 'published',
      },
      currentUser.id
    );

    setTitle('');
    setDescription('');
    setInstructions('');
    setFunctionalPurpose('');
    setMaterialsNeeded('');
    setSafetyGuidance('');
    setSupervisionGuidance('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Pediatric Therapy Activity Library
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-teal-100 text-teal-800">
              {filteredActivities.length} Activities
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            20 demonstration activities plus clinic custom entries. Immutable snapshots freeze instructions when published.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Add Custom Activity
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search activities, purpose, or materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="all">All Functional Categories</option>
            <option value="fine motor skills">Fine Motor Skills</option>
            <option value="bilateral coordination">Bilateral Coordination</option>
            <option value="visual-motor integration">Visual-Motor Integration</option>
            <option value="gross motor & proprioceptive">Gross Motor & Proprioceptive</option>
            <option value="self-care (adl)">Self-Care (ADL)</option>
            <option value="sensory & handwriting readiness">Sensory & Handwriting</option>
            <option value="oral-motor & self-regulation">Oral-Motor & Regulation</option>
          </select>
        </div>

        <div>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="all">All Difficulty Levels</option>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="challenging">Challenging</option>
          </select>
        </div>
      </div>

      {/* Activity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActivities.map((act) => (
          <div
            key={act.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:border-teal-300 transition-all card-subtle-shadow space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                  {act.category}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-600 capitalize">
                  {act.difficulty_level}
                </span>
              </div>

              <h3 className="text-sm font-bold font-heading text-slate-900 leading-snug">{act.title}</h3>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{act.description}</p>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-700 block uppercase">Functional Therapy Target</span>
                <p className="text-[11px] text-slate-600 line-clamp-2">{act.functional_purpose}</p>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  {act.estimated_duration_minutes} min
                </span>
                <span>•</span>
                <span>{act.suggested_frequency}</span>
              </div>
            </div>

            <button
              onClick={() => setPreviewActivity(act)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview Details & Safety
            </button>
          </div>
        ))}
      </div>

      {/* Activity Preview Modal */}
      {previewActivity && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-semibold text-teal-700 uppercase bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                  {previewActivity.category}
                </span>
                <h2 className="text-lg font-bold font-heading text-slate-900 mt-1">{previewActivity.title}</h2>
              </div>
              <button
                onClick={() => setPreviewActivity(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-800 block text-xs mb-1">Functional Clinical Purpose:</span>
                <p className="p-3 rounded-xl bg-teal-50/60 border border-teal-100 text-teal-900 leading-relaxed">
                  {previewActivity.functional_purpose}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block text-xs mb-1">Step-by-Step Instructions:</span>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 whitespace-pre-line leading-relaxed">
                  {previewActivity.instructions}
                </div>
              </div>

              {previewActivity.materials_needed && (
                <div>
                  <span className="font-bold text-slate-800 block text-xs mb-1">Required Household Materials:</span>
                  <p className="text-slate-600">{previewActivity.materials_needed}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block">Duration</span>
                  <span className="font-bold text-slate-800">{previewActivity.estimated_duration_minutes} minutes</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Suggested Schedule</span>
                  <span className="font-bold text-slate-800">{previewActivity.suggested_frequency}</span>
                </div>
              </div>

              {previewActivity.safety_guidance && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Safety Guidance:</span>
                    <span className="leading-relaxed">{previewActivity.safety_guidance}</span>
                  </div>
                </div>
              )}

              {previewActivity.supervision_guidance && (
                <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-sky-900">
                  <span className="font-bold block">Adult Supervision Guidance:</span>
                  <span className="leading-relaxed">{previewActivity.supervision_guidance}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setPreviewActivity(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold font-heading text-slate-900">Add Custom Clinic Activity</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tactile Shaving Cream Tracing"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="challenging">Challenging</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Brief Description *</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary for therapists and parents..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Functional Clinical Purpose *</label>
                <textarea
                  required
                  rows={2}
                  value={functionalPurpose}
                  onChange={(e) => setFunctionalPurpose(e.target.value)}
                  placeholder="Therapeutic rationale (e.g. intrinsic hand strength, proprioceptive input)..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Step-by-Step Instructions *</label>
                <textarea
                  required
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="1. Posture\n2. Technique\n3. Completion target..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Materials Needed</label>
                <input
                  type="text"
                  value={materialsNeeded}
                  onChange={(e) => setMaterialsNeeded(e.target.value)}
                  placeholder="e.g. Wooden clothespins, paper plates..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Suggested Frequency</label>
                  <input
                    type="text"
                    value={suggestedFrequency}
                    onChange={(e) => setSuggestedFrequency(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
