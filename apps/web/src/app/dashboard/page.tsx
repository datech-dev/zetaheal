'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/data-store';
import { calculateAge, formatDate } from '@/lib/utils';
import {
  Users,
  Home,
  Calendar,
  MessageSquare,
  AlertCircle,
  PlusCircle,
  FileCheck2,
  Target,
  Compass,
  ArrowRight,
  Smile,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const { currentClinic, currentRole, currentUser } = useAuth();
  const metrics = db.getDashboardMetrics(currentClinic.id);
  const children = db.getChildren(currentClinic.id);

  // Get recent caregiver submissions across this clinic
  const recentSubmissions = db.getCaregiverCompletions('c1000000-0000-0000-0000-000000000001');

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Clinic Header & Quick Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Clinical Care Dashboard
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-teal-100 text-teal-800">
              Live Tenant
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {currentClinic.name} • {currentClinic.address?.city}, {currentClinic.address?.state}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/children?modal=new"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Add Child Profile
          </Link>
          <Link
            href="/activities"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-all"
          >
            <Compass className="w-4 h-4 text-teal-600" />
            Activity Library (20)
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 card-subtle-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Children</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-heading text-slate-900 mt-2">
            {metrics.active_children_count}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Enrolled in therapy</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 card-subtle-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Home Programs</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-heading text-slate-900 mt-2">
            {metrics.active_home_programs_count}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Published to parents</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 card-subtle-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Caregiver Logs</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-heading text-slate-900 mt-2">
            {metrics.recent_submissions_count}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">100% adherence rate</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 card-subtle-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Goals Due Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-heading text-slate-900 mt-2">
            {metrics.goals_due_for_review_count}
          </div>
          <p className="text-[11px] text-amber-600 font-medium mt-1">Next 30 days</p>
        </div>
      </div>

      {/* Two Column Layout: Patient Workspace + Recent Caregiver Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enrolled Patients List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-heading text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              Assigned Patient Records ({children.length})
            </h2>
            <Link
              href="/children"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              View Full Directory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 card-subtle-shadow overflow-hidden">
            {children.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <p className="text-sm">No child records in this clinic yet.</p>
                <Link
                  href="/children?modal=new"
                  className="mt-3 inline-block text-xs font-semibold text-teal-700 underline"
                >
                  Create first child profile
                </Link>
              </div>
            ) : (
              children.map((child) => {
                const childGoals = db.getGoals(child.id);
                const activeGoals = childGoals.filter((g) => g.status === 'active');
                return (
                  <div
                    key={child.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/children/${child.id}`}
                          className="font-heading font-semibold text-slate-900 hover:text-teal-700 transition-colors"
                        >
                          {child.first_name} {child.last_name}
                        </Link>
                        <span className="text-xs text-slate-500">({calculateAge(child.date_of_birth)})</span>
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                          {child.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        <span className="font-medium text-slate-700">Concerns:</span> {child.functional_concerns}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3 text-teal-600" />
                          {activeGoals.length} Active Goals
                        </span>
                        <span>•</span>
                        <span>DOB: {formatDate(child.date_of_birth)}</span>
                      </div>
                    </div>

                    <Link
                      href={`/children/${child.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors whitespace-nowrap self-start sm:self-center"
                    >
                      Open Workspace <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Caregiver Feedback Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-heading text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              Between-Session Practice
            </h2>
            <span className="text-[11px] text-slate-400">Parent Logs</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 card-subtle-shadow space-y-4">
            <div className="p-3 bg-teal-50/70 rounded-lg border border-teal-100 text-xs text-teal-900 leading-relaxed">
              <span className="font-semibold block mb-0.5">Care-Coordination Feed</span>
              Caregivers log home activities via the mobile app. Clinical findings remain distinctly authored by therapists.
            </div>

            <div className="space-y-3">
              {recentSubmissions.slice(0, 3).map((sub) => (
                <div key={sub.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{sub.itemTitle}</span>
                    <span className="text-[10px] text-slate-400">{formatDate(sub.completion_date)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </span>
                    <span className="text-slate-500 capitalize">
                      Child: {sub.child_engagement}
                    </span>
                  </div>

                  {sub.caregiver_observations && (
                    <p className="text-xs text-slate-600 italic bg-white p-2 rounded border border-slate-100">
                      &quot;{sub.caregiver_observations}&quot;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
