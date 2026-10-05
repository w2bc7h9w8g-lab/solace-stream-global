// Data access layer. Pages depend only on this interface.
// Today: MockRepository. Later: SupabaseRepository using the generated client (RLS enforced),
// selected once Lovable Cloud / Supabase is connected. No credentials live in this file.
import * as m from "../mock-data";
import type {
  Appointment, AuditEvent, LeaderboardRow, PointsEntry, PsychologistPublic,
  PsychologistVerification, ScholarshipOpportunity, SupportRequest, University,
} from "../types";

export interface PsychologistFilters {
  q?: string; specialty?: string; language?: string; availableWithinDays?: number; population?: string;
}

export interface Repository {
  listPsychologists(f?: PsychologistFilters): Promise<PsychologistPublic[]>;
  getPsychologist(id: string): Promise<PsychologistPublic | null>;
  listAppointments(psychologistId: string): Promise<Appointment[]>;
  listVerifications(): Promise<PsychologistVerification[]>;
  listUniversities(): Promise<University[]>;
  listScholarships(): Promise<ScholarshipOpportunity[]>;
  getLeaderboard(): Promise<LeaderboardRow[]>;
  getPointsLedger(psychologistId: string): Promise<PointsEntry[]>;
  listSupportRequests(): Promise<SupportRequest[]>;
  listAuditEvents(): Promise<AuditEvent[]>;
}

const NOW = new Date("2026-10-05T00:00:00Z").getTime();

class MockRepository implements Repository {
  async listPsychologists(f: PsychologistFilters = {}) {
    return m.psychologists.filter((p) => {
      if (p.verification_status !== "verified") return false;
      if (f.specialty && !p.specialties.includes(f.specialty)) return false;
      if (f.language && !p.languages.includes(f.language)) return false;
      if (f.population && !p.populations.includes(f.population)) return false;
      if (f.availableWithinDays && !p.next_slots.some((s) => new Date(s).getTime() - NOW < f.availableWithinDays! * 864e5)) return false;
      if (f.q) {
        const q = f.q.toLowerCase();
        if (!(p.display_name + p.bio.pt + p.bio.en + p.region).toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }
  async getPsychologist(id: string) { return m.psychologists.find((p) => p.id === id) ?? null; }
  async listAppointments(pid: string) { return m.appointments.filter((a) => a.psychologist_id === pid); }
  async listVerifications() { return m.verifications; }
  async listUniversities() { return m.universities; }
  async listScholarships() { return m.scholarships; }
  async getLeaderboard() { return m.leaderboard; }
  async getPointsLedger(pid: string) { return m.pointsLedger.filter((e) => e.psychologist_id === pid); }
  async listSupportRequests() { return m.supportRequests; }
  async listAuditEvents() { return m.auditEvents; }
}

export const repo: Repository = new MockRepository();
