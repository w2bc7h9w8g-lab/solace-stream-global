// Domain types mirroring docs/supabase-schema.sql. Clinical content is never modeled here —
// only references (external_ref) to records held in a secure external store.

export type AppRole = "refugee" | "psychologist" | "university_partner" | "moderator" | "admin";
export type VerificationStatus = "pending" | "verified" | "rejected";
export type AppointmentStatus = "requested" | "confirmed" | "completed" | "cancelled";

export interface Profile {
  id: string;
  display_name: string;
  preferred_locale: string;
  country_region: string; // broad region only
  created_at: string;
}

export interface Specialty { id: string; slug: string; name: { pt: string; en: string } }
export interface Language { code: string; name: string }

export interface PsychologistPublic {
  id: string;
  display_name: string;
  bio: { pt: string; en: string };
  region: string;
  years_experience: number;
  specialties: string[]; // specialty slugs
  languages: string[]; // language codes
  populations: string[];
  modality: "online";
  verification_status: VerificationStatus; // only the status is public, never documents
  next_slots: string[]; // ISO
  points: number;
  sessions_completed: number;
  initials: string;
}

export interface PsychologistVerification {
  psychologist_id: string;
  status: VerificationStatus;
  council: string; // e.g. CRP-06 — stored masked in UI
  registration_masked: string;
  identity_doc_ref: string | null; // external secure storage reference
  background_check: "pending" | "clear" | "flagged";
  submitted_at: string;
  reviewed_by?: string;
}

export interface Availability { id: string; psychologist_id: string; weekday: number; start: string; end: string; timezone: string }

export interface Appointment {
  id: string;
  psychologist_id: string;
  refugee_alias: string;
  starts_at: string;
  duration_min: number;
  status: AppointmentStatus;
  meet_link: string | null;
  clinical_note_ref: string | null; // pointer only
  language: string;
}

export interface University { id: string; name: string; country: string; partnership_status: "prospective" | "active" }
export interface ScholarshipOpportunity {
  id: string;
  university_id: string;
  program: { pt: string; en: string };
  discount_pct: number; // capped at 15 by program rule
  min_points: number;
  seats: number;
  deadline: string;
}

export interface PointsEntry { id: string; psychologist_id: string; delta: number; reason: string; created_at: string }
export interface LeaderboardRow { psychologist_id: string; display_name: string; initials: string; points: number; sessions: number; region: string; badges: string[] }

export interface SupportRequest { id: string; category: "emergency" | "technical" | "safety" | "other"; status: "open" | "routed" | "closed"; created_at: string; summary: string }
export interface Consent { key: string; granted: boolean; updated_at: string }
export interface AuditEvent { id: string; actor: string; action: string; target: string; created_at: string }

export const MAX_SCHOLARSHIP_PCT = 15;
