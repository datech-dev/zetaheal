'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Compass,
  FileCheck2,
  FileText,
  ShieldAlert,
  Settings,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export function Sidebar() {
  const pathname = usePathname();
  const { currentRole } = useAuth();

  const navItems = [
    {
      label: 'Main Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Child Directory',
      href: '/children',
      icon: Users,
    },
    {
      label: 'Activity Library',
      href: '/activities',
      icon: Compass,
    },
    {
      label: 'Assessments',
      href: '/assessments',
      icon: FileCheck2,
    },
    {
      label: 'Outcome Reports',
      href: '/reports',
      icon: FileText,
    },
    ...(currentRole === 'clinic_owner'
      ? [
          {
            label: 'Audit Events',
            href: '/audit',
            icon: ShieldAlert,
          },
        ]
      : []),
    {
      label: 'Onboarding Wizard',
      href: '/onboarding',
      icon: Sparkles,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Clinical Workspace
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-teal-50 text-teal-800 font-semibold border-l-4 border-teal-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              <item.icon className={cn('w-4 h-4', isActive ? 'text-teal-700' : 'text-slate-400')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="mt-8 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2">
        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Clinical Workflow Active
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          Zeta Heal facilitates goal-linked therapy coordination and documentation. Not an autonomous diagnostic device.
        </p>
      </div>
    </aside>
  );
}
