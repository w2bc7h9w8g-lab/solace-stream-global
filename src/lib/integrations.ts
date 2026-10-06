// External integration contracts. All implementations are MOCKS for the MVP.
// Real implementations must run server-side (createServerFn) with secrets in server env only.

/** Google Meet — create a meeting link for a confirmed appointment. */
export interface MeetingProvider { createMeeting(appointmentId: string, startsAt: string): Promise<{ url: string }> }
export const meetProvider: MeetingProvider = {
  async createMeeting(id) { return { url: `https://meet.google.com/mock-${id}` }; },
};

/** Secure clinical storage (e.g. Google Cloud / enterprise Drive). Supabase only stores the returned ref. */
export interface SecureClinicalStore {
  putNote(appointmentId: string, content: string): Promise<{ ref: string }>;
  getSignedAccess(ref: string, requesterId: string): Promise<{ url: string; expiresAt: string }>;
}
export const clinicalStore: SecureClinicalStore = {
  async putNote(id) { return { ref: `ext://secure-store/notes/${id}-${Date.now()}` }; },
  async getSignedAccess(ref) { return { url: `#mock-signed:${ref}`, expiresAt: new Date(Date.now() + 3e5).toISOString() }; },
};

/** AI assistant — supportive only. Never diagnoses or makes clinical decisions. */
export interface TriageResult { urgency: "routine" | "priority" | "crisis_signals"; suggestedSpecialties: string[]; suggestedLanguages: string[]; disclaimer: string }
export interface AIAssistant {
  triage(answers: Record<string, string>): Promise<TriageResult>;
  draftSessionSummary(bulletPoints: string): Promise<string>;
  moderateForumPost(text: string): Promise<{ flagged: boolean; reasons: string[] }>;
}
const CRISIS = /suic|morrer|matar|kill|die|end my life|self.?harm/i;
export const ai: AIAssistant = {
  async triage(a) {
    const text = Object.values(a).join(" ");
    const urgency = CRISIS.test(text) ? "crisis_signals" : a['distress'] === "high" ? "priority" : "routine";
    const map: Record<string, string> = { sleep: "anxiety", loss: "grief", violence: "trauma", family: "family", adapt: "acculturation" };
    const language = a['language'];
    return { urgency, suggestedSpecialties: [map[a['topic'] ?? ''] ?? "anxiety"], suggestedLanguages: language ? [language] : [],
      disclaimer: "Orientação preliminar automatizada. Não é diagnóstico." };
  },
  async draftSessionSummary(b) {
    return `RASCUNHO — revisar antes de salvar\n\nTemas abordados:\n${b.split("\n").filter(Boolean).map((l) => `• ${l.trim()}`).join("\n")}\n\nPróximos passos: (a definir pelo psicólogo)`;
  },
  async moderateForumPost(t) { const flagged = CRISIS.test(t); return { flagged, reasons: flagged ? ["possible_crisis_language"] : [] }; },
};
