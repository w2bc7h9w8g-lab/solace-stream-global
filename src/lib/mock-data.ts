import type {
  Appointment, AuditEvent, Language, LeaderboardRow, PointsEntry, PsychologistPublic,
  PsychologistVerification, ScholarshipOpportunity, Specialty, SupportRequest, University,
} from "./types";

// FICTIONAL demonstration data. No real people or institutions.
const d = (days: number, h = 10) => {
  const x = new Date("2026-10-05T00:00:00Z");
  x.setUTCDate(x.getUTCDate() + days);
  x.setUTCHours(h);
  return x.toISOString();
};

export const specialties: Specialty[] = [
  { id: "s1", slug: "trauma", name: { pt: "Trauma e TEPT", en: "Trauma & PTSD" } },
  { id: "s2", slug: "anxiety", name: { pt: "Ansiedade", en: "Anxiety" } },
  { id: "s3", slug: "grief", name: { pt: "Luto", en: "Grief" } },
  { id: "s4", slug: "children", name: { pt: "Crianças e adolescentes", en: "Children & adolescents" } },
  { id: "s5", slug: "family", name: { pt: "Família e vínculos", en: "Family & relationships" } },
  { id: "s6", slug: "acculturation", name: { pt: "Adaptação cultural", en: "Acculturation" } },
  { id: "s7", slug: "gbv", name: { pt: "Violência de gênero", en: "Gender-based violence" } },
];

export const languages: Language[] = [
  { code: "pt", name: "Português" }, { code: "en", name: "English" }, { code: "es", name: "Español" },
  { code: "fr", name: "Français" }, { code: "ar", name: "العربية" }, { code: "uk", name: "Українська" },
  { code: "fa", name: "فارسی" }, { code: "sw", name: "Kiswahili" },
];

export const psychologists: PsychologistPublic[] = [
  { id: "p1", display_name: "Dra. Helena M.", initials: "HM", region: "América do Sul", years_experience: 12,
    bio: { pt: "Psicóloga clínica com foco em trauma e migração forçada. Abordagem humanista e sensível à cultura.", en: "Clinical psychologist focused on trauma and forced migration. Humanistic, culturally sensitive approach." },
    specialties: ["trauma", "acculturation", "grief"], languages: ["pt", "es", "en"], populations: ["adults", "women"],
    modality: "online", verification_status: "verified", next_slots: [d(1, 13), d(2, 15), d(4, 11)], points: 1840, sessions_completed: 92 },
  { id: "p2", display_name: "Karim A.", initials: "KA", region: "Europa Ocidental", years_experience: 8,
    bio: { pt: "Atendo em árabe e francês. Experiência em campos de acolhimento e TCC focada em trauma.", en: "Sessions in Arabic and French. Experience in reception centers and trauma-focused CBT." },
    specialties: ["trauma", "anxiety"], languages: ["ar", "fr", "en"], populations: ["adults", "men"],
    modality: "online", verification_status: "verified", next_slots: [d(1, 9), d(3, 17)], points: 1610, sessions_completed: 77 },
  { id: "p3", display_name: "Olena K.", initials: "OK", region: "Europa Oriental", years_experience: 15,
    bio: { pt: "Psicoterapeuta infantil e familiar. Trabalho com famílias deslocadas pela guerra.", en: "Child and family psychotherapist working with war-displaced families." },
    specialties: ["children", "family", "trauma"], languages: ["uk", "en", "pt"], populations: ["children", "families"],
    modality: "online", verification_status: "verified", next_slots: [d(2, 10)], points: 1475, sessions_completed: 68 },
  { id: "p4", display_name: "Amani W.", initials: "AW", region: "África Oriental", years_experience: 6,
    bio: { pt: "Foco em violência de gênero e fortalecimento comunitário.", en: "Focus on gender-based violence and community resilience." },
    specialties: ["gbv", "anxiety", "grief"], languages: ["sw", "en", "fr"], populations: ["women", "adolescents"],
    modality: "online", verification_status: "verified", next_slots: [d(1, 16), d(5, 12)], points: 1220, sessions_completed: 54 },
  { id: "p5", display_name: "Reza T.", initials: "RT", region: "Oriente Médio", years_experience: 10,
    bio: { pt: "Atendimento em persa e inglês, com ênfase em luto e adaptação cultural.", en: "Sessions in Persian and English, emphasizing grief and acculturation." },
    specialties: ["grief", "acculturation"], languages: ["fa", "en"], populations: ["adults"],
    modality: "online", verification_status: "verified", next_slots: [d(3, 14)], points: 980, sessions_completed: 41 },
  { id: "p6", display_name: "Lucía R.", initials: "LR", region: "América Central", years_experience: 4,
    bio: { pt: "Psicóloga com atuação em ansiedade e adaptação de jovens migrantes.", en: "Psychologist working on anxiety and adaptation for young migrants." },
    specialties: ["anxiety", "children", "acculturation"], languages: ["es", "pt", "en"], populations: ["adolescents"],
    modality: "online", verification_status: "verified", next_slots: [d(1, 18), d(2, 18)], points: 760, sessions_completed: 29 },
];

export const verifications: PsychologistVerification[] = [
  { psychologist_id: "p7", status: "pending", council: "CRP-06", registration_masked: "06/••••12", identity_doc_ref: "ext://secure-store/idv/7a1", background_check: "pending", submitted_at: d(-1) },
  { psychologist_id: "p8", status: "pending", council: "CRP-05", registration_masked: "05/••••88", identity_doc_ref: "ext://secure-store/idv/9c2", background_check: "clear", submitted_at: d(-2) },
  { psychologist_id: "p9", status: "rejected", council: "CRP-04", registration_masked: "04/••••03", identity_doc_ref: null, background_check: "flagged", submitted_at: d(-6), reviewed_by: "admin-1" },
];

export const appointments: Appointment[] = [
  { id: "a1", psychologist_id: "p1", refugee_alias: "Usuário #A7F2", starts_at: d(1, 13), duration_min: 50, status: "confirmed", meet_link: "https://meet.google.com/mock-abc-defg", clinical_note_ref: null, language: "es" },
  { id: "a2", psychologist_id: "p1", refugee_alias: "Usuário #B19C", starts_at: d(2, 15), duration_min: 50, status: "requested", meet_link: null, clinical_note_ref: null, language: "pt" },
  { id: "a3", psychologist_id: "p1", refugee_alias: "Usuário #C330", starts_at: d(-2, 11), duration_min: 50, status: "completed", meet_link: null, clinical_note_ref: "ext://secure-store/notes/c330-01", language: "en" },
  { id: "a4", psychologist_id: "p1", refugee_alias: "Usuário #D04E", starts_at: d(-5, 9), duration_min: 50, status: "completed", meet_link: null, clinical_note_ref: null, language: "es" },
];

export const universities: University[] = [
  { id: "u1", name: "Universidade Exemplo A (fictícia)", country: "BR", partnership_status: "prospective" },
  { id: "u2", name: "Example Institute B (fictional)", country: "PT", partnership_status: "prospective" },
  { id: "u3", name: "Demo University C (fictional)", country: "CA", partnership_status: "prospective" },
];

export const scholarships: ScholarshipOpportunity[] = [
  { id: "sc1", university_id: "u1", program: { pt: "Especialização em Psicologia do Trauma", en: "Specialization in Trauma Psychology" }, discount_pct: 15, min_points: 1000, seats: 10, deadline: d(40) },
  { id: "sc2", university_id: "u2", program: { pt: "Pós-graduação em Saúde Mental Global", en: "Postgraduate in Global Mental Health" }, discount_pct: 10, min_points: 600, seats: 6, deadline: d(55) },
  { id: "sc3", university_id: "u3", program: { pt: "Certificado em Psicologia Intercultural", en: "Certificate in Intercultural Psychology" }, discount_pct: 12, min_points: 400, seats: 15, deadline: d(25) },
];

export const leaderboard: LeaderboardRow[] = psychologists
  .map((p) => ({ psychologist_id: p.id, display_name: p.display_name, initials: p.initials, points: p.points, sessions: p.sessions_completed, region: p.region,
    badges: [p.sessions_completed > 50 ? "50+" : "", p.languages.length >= 3 ? "polyglot" : "", p.years_experience >= 10 ? "mentor" : ""].filter(Boolean) }))
  .sort((a, b) => b.points - a.points);

export const pointsLedger: PointsEntry[] = [
  { id: "l1", psychologist_id: "p1", delta: 20, reason: "session_completed", created_at: d(-2) },
  { id: "l2", psychologist_id: "p1", delta: 20, reason: "session_completed", created_at: d(-5) },
  { id: "l3", psychologist_id: "p1", delta: 50, reason: "training_completed", created_at: d(-9) },
  { id: "l4", psychologist_id: "p1", delta: 10, reason: "availability_kept", created_at: d(-12) },
];

export const supportRequests: SupportRequest[] = [
  { id: "r1", category: "safety", status: "open", created_at: d(0, 8), summary: "Relato de comportamento inadequado em mensagem" },
  { id: "r2", category: "technical", status: "routed", created_at: d(-1), summary: "Link de sessão não abriu" },
  { id: "r3", category: "emergency", status: "routed", created_at: d(-1, 22), summary: "Usuário encaminhado a serviço local de emergência" },
];

export const auditEvents: AuditEvent[] = [
  { id: "e1", actor: "admin-1", action: "verification.reject", target: "p9", created_at: d(-5) },
  { id: "e2", actor: "p1", action: "clinical_note.ref_created", target: "a3", created_at: d(-2) },
  { id: "e3", actor: "mod-2", action: "support.route", target: "r3", created_at: d(-1, 22) },
  { id: "e4", actor: "system", action: "consent.updated", target: "user-A7F2", created_at: d(-1) },
];
