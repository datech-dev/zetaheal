'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Building2, UserCheck, ShieldCheck, HeartPulse, User } from 'lucide-react';

export function Navbar() {
  const { currentUser, currentClinic, currentRole, switchClinic, switchRole, allClinics } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top Multi-Tenant & Evaluator Switcher Bar */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-medium text-slate-300">Multi-Tenant Simulator:</span>
          <span className="text-slate-400">Tenant Isolation & RBAC Active</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3 h-3 text-slate-400" />
            <span className="text-slate-400">Clinic:</span>
            <select
              value={currentClinic.id}
              onChange={(e) => switchClinic(e.target.value)}
              className="bg-slate-800 text-emerald-300 border border-slate-700 rounded px-2 py-0.5 text-xs focus:outline-none"
            >
              {allClinics.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3 h-3 text-slate-400" />
            <span className="text-slate-400">Active Role:</span>
            <select
              value={currentRole}
              onChange={(e) => switchRole(e.target.value as any)}
              className="bg-slate-800 text-sky-300 border border-slate-700 rounded px-2 py-0.5 text-xs focus:outline-none"
            >
              <option value="clinic_owner">Clinic Owner (Full Access)</option>
              <option value="occupational_therapist">Occupational Therapist</option>
              <option value="clinic_admin">Clinic Admin (Restricted Clinical)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center text-white shadow-sm">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-xl text-slate-900 tracking-tight">Zeta Heal</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-teal-50 text-teal-700 rounded-full border border-teal-200">
                  OT Pathway
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Pediatric Occupational Therapy Care Platform</p>
            </div>
          </Link>
        </div>

        {/* Clinic & Profile details */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-900">{currentClinic.name}</div>
            <div className="text-[11px] text-slate-500 capitalize">{currentRole.replace('_', ' ')}</div>
          </div>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-teal-100 border border-teal-300 text-teal-800 font-semibold text-xs flex items-center justify-center">
              {currentUser.display_name.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-medium text-slate-800 leading-tight">{currentUser.display_name}</div>
              <div className="text-[10px] text-slate-400">{currentUser.email}</div>
            </div>
          </div>

          <Link
            href="/onboarding"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Onboarding Wizard
          </Link>
        </div>
      </div>
    </header>
  );
}
