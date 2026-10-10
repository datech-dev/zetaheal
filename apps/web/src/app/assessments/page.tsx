'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/data-store';
import { formatDate } from '@/lib/utils';
import { FileCheck2, ArrowRight, ShieldCheck, CheckCircle2, Calendar } from 'lucide-react';

export default function AssessmentsDirectoryPage() {
  const { currentClinic } = useAuth();
  const children = db.getChildren(currentClinic.id);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
            Clinical Assessments & Evaluations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Structured baselines and review evaluations across enrolled children in {currentClinic.name}.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {children.map((child) => {
          const assessments = db.getAssessments(child.id);
          return (
            <div key={child.id} className="bg-white rounded-2xl border border-slate-200 p-6 card-subtle-shadow space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-slate-900 text-base">
                    {child.first_name} {child.last_name}
                  </span>
                  <span className="text-xs text-slate-400">({assessments.length} Evaluations recorded)</span>
                </div>
                <Link
                  href={`/children/${child.id}`}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                >
                  Child Workspace <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {assessments.length === 0 ? (
                <p className="text-xs text-slate-400">No baseline assessment finalized yet.</p>
              ) : (
                <div className="space-y-3">
                  {assessments.map((ass) => (
                    <div key={ass.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">Pediatric Functional Baseline Assessment</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">{formatDate(ass.assessment_date)}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                            {ass.status} (Locked)
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-600 italic bg-white p-3 rounded-lg border border-slate-100">
                        &ldquo;{ass.clinical_interpretation}&rdquo;
                      </p>
                      <div className="text-[11px] text-slate-400 pt-1">
                        Next Scheduled Review: <span className="font-semibold text-slate-700">{formatDate(ass.next_review_date || '')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
