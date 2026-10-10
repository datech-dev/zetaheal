'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/data-store';
import { formatDate } from '@/lib/utils';
import { FileText, Printer, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ReportsDirectoryPage() {
  const { currentClinic } = useAuth();
  const children = db.getChildren(currentClinic.id);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
            Clinical Outcome Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Formal documentation, progress summaries, and print-ready clinical evaluations.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {children.map((child) => {
          const reports = db.getReports(child.id);
          return (
            <div key={child.id} className="bg-white rounded-2xl border border-slate-200 p-6 card-subtle-shadow space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-heading font-bold text-slate-900 text-base">
                  {child.first_name} {child.last_name}
                </span>
                <Link
                  href={`/children/${child.id}`}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                >
                  Generate or View in Workspace <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {reports.length === 0 ? (
                <p className="text-xs text-slate-400">No generated reports for this child yet.</p>
              ) : (
                <div className="space-y-3">
                  {reports.map((rep) => (
                    <div key={rep.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-800 text-sm block">{rep.title}</span>
                        <p className="text-slate-500 text-[11px]">
                          Report Period: {formatDate(rep.period_start)} to {formatDate(rep.period_end)} • Created: {formatDate(rep.created_at)}
                        </p>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          {rep.parent_accessible ? 'Caregiver Permitted' : 'Therapist Internal'}
                        </span>
                      </div>

                      <Link
                        href={`/children/${child.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100 font-semibold self-start sm:self-center transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Print / Export
                      </Link>
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
