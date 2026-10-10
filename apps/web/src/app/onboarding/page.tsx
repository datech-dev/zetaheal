'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Building2,
  User,
  Users,
  Target,
  Compass,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function OnboardingWizardPage() {
  const router = useRouter();
  const { currentClinic } = useAuth();
  const [step, setStep] = useState(1);

  // Form State
  const [clinicName, setClinicName] = useState(currentClinic.name);
  const [contactEmail, setContactEmail] = useState(currentClinic.contact_email);
  const [contactPhone, setContactPhone] = useState(currentClinic.contact_phone || '+91 44 2499 1234');
  const [city, setCity] = useState(currentClinic.address?.city || 'Chennai');
  const [stateName, setStateName] = useState(currentClinic.address?.state || 'Tamil Nadu');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [defaultLang, setDefaultLang] = useState('en');

  // Step 2 Owner
  const [ownerName, setOwnerName] = useState('Dr. Priya Sharma');
  const [ownerRole, setOwnerRole] = useState('Clinic Owner & Senior OT');

  // Step 3 Staff
  const [therapistEmail, setTherapistEmail] = useState('colleague@example.com');
  const [therapistsInvited, setTherapistsInvited] = useState<string[]>(['ananya.k@lotuspediatric.example']);

  // Step 4 Goal Domains
  const [selectedDomains, setSelectedDomains] = useState<string[]>([
    'fine_motor',
    'visual_motor',
    'self_care',
    'sensory_processing',
    'bilateral_coordination',
  ]);

  const toggleDomain = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const handleAddTherapist = () => {
    if (therapistEmail) {
      setTherapistsInvited([...therapistsInvited, therapistEmail]);
      setTherapistEmail('');
    }
  };

  const handleFinish = () => {
    router.push('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          6-Step Clinic Onboarding Wizard
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight">
          Welcome to Zeta Heal
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Establish your pediatric occupational therapy workspace, configure functional domains, and prepare home activity care coordination.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        {[
          { num: 1, label: 'Clinic Info', icon: Building2 },
          { num: 2, label: 'Owner', icon: User },
          { num: 3, label: 'Staff', icon: Users },
          { num: 4, label: 'Goal Domains', icon: Target },
          { num: 5, label: 'Activities', icon: Compass },
          { num: 6, label: 'Launch', icon: CheckCircle2 },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`flex flex-col items-center gap-1 group text-xs font-medium transition-all ${
              step === s.num
                ? 'text-teal-700 font-bold'
                : step > s.num
                ? 'text-emerald-600'
                : 'text-slate-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                step === s.num
                  ? 'bg-teal-700 text-white shadow-sm'
                  : step > s.num
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <span className="hidden sm:inline text-[11px]">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Step Content Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 card-subtle-shadow space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold font-heading text-slate-900">Step 1: Clinic Profile & Regional Settings</h2>
            <p className="text-xs text-slate-500">Provide legal and communication details for clinical correspondence.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Clinic Name</label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City & State</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-1/2 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="State"
                    className="w-1/2 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                  <option value="UTC">UTC (GMT)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Language</label>
                <select
                  value={defaultLang}
                  onChange={(e) => setDefaultLang(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="en">English</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold font-heading text-slate-900">Step 2: Account Owner & Professional Credentials</h2>
            <p className="text-xs text-slate-500">The primary clinical license holder overseeing practice standards.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name & Degree</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={ownerRole}
                  onChange={(e) => setOwnerRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs text-teal-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-teal-700 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold block mb-0.5">Role Authorization Notice</span>
                The clinic owner possesses administrative authority to manage memberships, configure clinic activity templates, and access clinic audit events.
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold font-heading text-slate-900">Step 3: Invite Clinic Staff & Therapists</h2>
            <p className="text-xs text-slate-500">Add occupational therapists or clinic administrators (can also be done later).</p>

            <div className="flex gap-2 pt-2">
              <input
                type="email"
                placeholder="colleague@example.com"
                value={therapistEmail}
                onChange={(e) => setTherapistEmail(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <button
                type="button"
                onClick={handleAddTherapist}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
              >
                Send Invite
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold text-slate-700">Invited / Active Members:</div>
              {therapistsInvited.map((email, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800"
                >
                  <span className="font-medium">{email}</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-medium text-[10px]">
                    Occupational Therapist
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold font-heading text-slate-900">Step 4: Configure Functional Goal Domains</h2>
            <p className="text-xs text-slate-500">Select the pediatric skill categories relevant to your clinic&apos;s therapy programs.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { key: 'fine_motor', label: 'Fine Motor & Pencil Grasp', desc: 'Pincer grasp, finger isolation, hand strength' },
                { key: 'visual_motor', label: 'Visual-Motor Integration', desc: 'Cutting, drawing shapes, eye-hand alignment' },
                { key: 'self_care', label: 'Self-Care & Daily Living (ADL)', desc: 'Fasteners, buttoning, dressing, grooming' },
                { key: 'feeding', label: 'Feeding Functional Skills', desc: 'Utensil use, cup drinking, chewing mechanics' },
                { key: 'sensory_processing', label: 'Sensory Processing & Regulation', desc: 'Tactile tolerance, proprioceptive heavy work' },
                { key: 'bilateral_coordination', label: 'Bilateral Coordination', desc: 'Two-handed tasks, midline crossing' },
                { key: 'gross_motor', label: 'Gross Motor & Balance', desc: 'Postural control, vestibular stability' },
                { key: 'social_participation', label: 'Play & Social Participation', desc: 'Imitation, turn-taking, peer play' },
              ].map((domain) => {
                const isSelected = selectedDomains.includes(domain.key);
                return (
                  <button
                    key={domain.key}
                    type="button"
                    onClick={() => toggleDomain(domain.key)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/60 ring-1 ring-teal-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-teal-900' : 'text-slate-800'}`}>
                        {domain.label}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-700" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{domain.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold font-heading text-slate-900">Step 5: Curated Activity Catalog Ready</h2>
            <p className="text-xs text-slate-500">
              Zeta Heal provides 20 demonstration activities with instructions, materials, and safety guidance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                <span className="text-xl font-bold font-heading text-teal-700">20</span>
                <span className="block text-xs font-semibold text-slate-800">Demonstration Activities</span>
                <span className="block text-[10px] text-slate-400">Curated & Safe</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                <span className="text-xl font-bold font-heading text-sky-700">8</span>
                <span className="block text-xs font-semibold text-slate-800">Pediatric Domains</span>
                <span className="block text-[10px] text-slate-400">Fine Motor, ADL, Sensory</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                <span className="text-xl font-bold font-heading text-emerald-700">100%</span>
                <span className="block text-xs font-semibold text-slate-800">Customizable</span>
                <span className="block text-[10px] text-slate-400">Add Clinic Activities</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-amber-50 p-3 rounded-lg border border-amber-200">
              <span className="font-semibold text-amber-900 block mb-0.5">Clinical Note:</span>
              Demonstration activities serve as safe therapeutic play examples. Therapists formulate clinical assignments tailored to each child&apos;s evaluated functional level.
            </p>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4 text-center py-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold font-heading text-slate-900">Workspace Configured!</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your clinic is ready. You can now enroll your first child, define functional goals, and publish home activity routines.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-sm transition-all"
              >
                Go to Main Dashboard
              </button>
              <button
                onClick={() => router.push('/children?modal=new')}
                className="px-6 py-2.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-all"
              >
                Enroll First Child Profile
              </button>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className={`inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              step === 1
                ? 'opacity-0 pointer-events-none'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>

          {step < 6 && (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1 px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-all"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
