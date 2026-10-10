'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/data-store';
import { calculateAge, formatDate } from '@/lib/utils';
import {
  Users,
  Search,
  PlusCircle,
  Filter,
  ArrowRight,
  Target,
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function ChildrenDirectoryPage() {
  const { currentClinic, currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Child Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('male');
  const [functionalConcerns, setFunctionalConcerns] = useState('');
  const [clinicalHistory, setClinicalHistory] = useState('');
  const [formError, setFormError] = useState('');

  // Fetch children for current clinic
  const allChildren = db.getChildren(currentClinic.id, searchTerm);
  const filteredChildren = statusFilter === 'all'
    ? allChildren
    : allChildren.filter((c) => c.status === statusFilter);

  const handleCreateChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !dateOfBirth || !functionalConcerns.trim()) {
      setFormError('Please fill in First Name, Last Name, Date of Birth, and Functional Concerns.');
      return;
    }

    db.createChild(
      {
        clinic_id: currentClinic.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        date_of_birth: dateOfBirth,
        gender,
        functional_concerns: functionalConcerns.trim(),
        clinical_history: clinicalHistory.trim(),
        assigned_therapist_id: currentUser.id,
        status: 'active',
      },
      currentUser.id
    );

    // Reset & close
    setFirstName('');
    setLastName('');
    setDateOfBirth('');
    setFunctionalConcerns('');
    setClinicalHistory('');
    setFormError('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Child Patient Directory
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-teal-100 text-teal-800">
              {filteredChildren.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Scoped to {currentClinic.name}. De-identified UUID URLs ensure privacy.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Add Child Profile
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by child name or functional concerns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="active">Active Only</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
            <option value="all">All Records</option>
          </select>
        </div>
      </div>

      {/* Children Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChildren.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-xl border border-slate-200">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">No child records found</h3>
            <p className="text-xs text-slate-400 mt-1">Adjust search filter or enroll a new patient.</p>
          </div>
        ) : (
          filteredChildren.map((child) => {
            const goals = db.getGoals(child.id);
            const activeGoals = goals.filter((g) => g.status === 'active');
            const homePrograms = db.getHomePrograms(child.id);

            return (
              <div
                key={child.id}
                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-teal-300 transition-all card-subtle-shadow space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold font-heading text-slate-900">
                        {child.first_name} {child.last_name}
                      </h3>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Age: {calculateAge(child.date_of_birth)}</span>
                        <span>•</span>
                        <span className="capitalize">{child.gender}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full capitalize">
                      {child.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-800">Primary Concerns: </span>
                    {child.functional_concerns}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2 rounded bg-teal-50/50 border border-teal-100">
                      <span className="text-[10px] text-teal-700 block font-medium">Active Goals</span>
                      <span className="text-sm font-bold text-teal-900">{activeGoals.length}</span>
                    </div>
                    <div className="p-2 rounded bg-sky-50/50 border border-sky-100">
                      <span className="text-[10px] text-sky-700 block font-medium">Home Program</span>
                      <span className="text-sm font-bold text-sky-900">
                        {homePrograms.some((hp) => hp.status === 'published') ? 'Published' : 'None'}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/children/${child.id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors"
                >
                  Enter Clinical Workspace <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })
        )}
      </div>

      {/* Add Child Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold font-heading text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                Enroll New Pediatric Patient
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateChild} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Aarav"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Sundaram"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Functional Concerns *</label>
                <textarea
                  required
                  rows={2}
                  value={functionalConcerns}
                  onChange={(e) => setFunctionalConcerns(e.target.value)}
                  placeholder="Primary reasons for OT referral (e.g., fine motor grasp fatigue, sensory aversion)..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Background History</label>
                <textarea
                  rows={2}
                  value={clinicalHistory}
                  onChange={(e) => setClinicalHistory(e.target.value)}
                  placeholder="Birth history, pediatric referrals, developmental milestones..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-all"
                >
                  Save Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
