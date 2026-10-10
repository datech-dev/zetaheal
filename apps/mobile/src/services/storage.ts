// ==============================================================================
// Zeta Heal (OT Pathway) - Parent Mobile Storage & Token Service
// ==============================================================================

export interface CaregiverSession {
  token: string;
  caregiverId: string;
  childId: string;
  childName: string;
  clinicName: string;
}

// In-memory & AsyncStorage-compatible secure session holder
class MobileStorageService {
  private session: CaregiverSession | null = {
    token: 'jwt-caregiver-session-token-aarav',
    caregiverId: 'cg100000-0000-0000-0000-000000000001',
    childId: 'c1000000-0000-0000-0000-000000000001',
    childName: 'Aarav Sundaram',
    clinicName: 'Lotus Pediatric Therapy Center',
  };

  public async getSession(): Promise<CaregiverSession | null> {
    return this.session;
  }

  public async setSession(session: CaregiverSession): Promise<void> {
    this.session = session;
  }

  public async clearSession(): Promise<void> {
    this.session = null;
  }

  public generateIdempotencyKey(): string {
    return `mob-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const mobileStorage = new MobileStorageService();
