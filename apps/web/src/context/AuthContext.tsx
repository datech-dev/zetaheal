'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MembershipRole, UserProfile, Clinic } from '@zetaheal/shared-types';
import { db } from '@/lib/data-store';

interface AuthContextType {
  currentUser: UserProfile;
  currentClinic: Clinic;
  currentRole: MembershipRole;
  switchUser: (userId: string) => void;
  switchClinic: (clinicId: string) => void;
  switchRole: (role: MembershipRole) => void;
  allClinics: Clinic[];
  allUsers: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(db.users[0]);
  const [currentClinic, setCurrentClinic] = useState<Clinic>(db.clinics[0]);
  const [currentRole, setCurrentRole] = useState<MembershipRole>('clinic_owner');

  const switchUser = (userId: string) => {
    const user = db.users.find((u) => u.id === userId);
    if (user) setCurrentUser(user);
  };

  const switchClinic = (clinicId: string) => {
    const clinic = db.clinics.find((c) => c.id === clinicId);
    if (clinic) setCurrentClinic(clinic);
  };

  const switchRole = (role: MembershipRole) => {
    setCurrentRole(role);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentClinic,
        currentRole,
        switchUser,
        switchClinic,
        switchRole,
        allClinics: db.clinics,
        allUsers: db.users,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
