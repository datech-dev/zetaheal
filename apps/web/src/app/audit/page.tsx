'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/data-store';
import { formatDate } from '@/lib/utils';
import { ShieldAlert, ShieldCheck, Lock, Activity } from 'lucide-react';

export default function AuditEventsPage() {
  const { currentClinic, currentRole } = useAuth();
  const auditEvents = db.getAuditEvents(currentClinic.id);

  if (currentRole !== 'clinic_owner') {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 card-subtle-shadow max-w-xl mx-auto space-y-4">
        <Lock className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Restricted to Clinic Owners</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The audit event log contains sensitive accountability records and is restricted to the clinic owner role.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Clinic Security & Audit Log
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
              Immutable
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking sensitive clinical record modifications, caregiver links, and authorization events for {currentClinic.name}.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 card-subtle-shadow overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 font-semibold grid grid-cols-12 gap-2">
          <div className="col-span-3">Timestamp</div>
          <div className="col-span-3">Action</div>
          <div className="col-span-2">Actor Role</div>
          <div className="col-span-2">Entity</div>
          <div className="col-span-2 text-right">Details</div>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {auditEvents.map((evt) => (
            <div key={evt.id} className="p-4 grid grid-cols-12 gap-2 items-center hover:bg-slate-50 transition-colors">
              <div className="col-span-3 text-slate-500 font-mono text-[11px]">
                {new Date(evt.created_at).toLocaleString()}
              </div>

              <div className="col-span-3 font-semibold text-slate-900">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px]">
                  {evt.action}
                </span>
              </div>

              <div className="col-span-2 text-slate-600 capitalize">
                {evt.actor_role.replace('_', ' ')}
              </div>

              <div className="col-span-2 text-slate-500 capitalize">
                {evt.entity_type}
              </div>

              <div className="col-span-2 text-right font-mono text-[10px] text-slate-400 truncate">
                {JSON.stringify(evt.metadata || {})}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
