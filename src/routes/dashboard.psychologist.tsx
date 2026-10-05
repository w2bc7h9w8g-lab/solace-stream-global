import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/Layout";
import { fmtDate } from "@/components/PsychologistCard";
import { useLocale, useT } from "@/lib/i18n";
import { repo } from "@/lib/data/repository";
import { ai, clinicalStore } from "@/lib/integrations";

export const Route = createFileRoute("/dashboard/psychologist")({
  head: () => ({ meta: [
    { title: "Painel do psicólogo — Programa Refugiados UNESCO" },
    { name: "description", content: "Sessões, pontos, verificação e resumo pós-atendimento assistido por IA." },
    { property: "og:title", content: "Painel do psicólogo" },
    { property: "og:description", content: "Gerencie seus atendimentos voluntários." },
  ] }),
  loader: async () => ({
    appts: await repo.listAppointments("p1"),
    ledger: await repo.getPointsLedger("p1"),
    me: await repo.getPsychologist("p1"),
  }),
  component: Dash,
});

function Dash() {
  const { appts, ledger, me } = Route.useLoaderData();
  const t = useT();
  const { locale } = useLocale();
  const [notes, setNotes] = useState("");
  const [draft, setDraft] = useState("");
  const [savedRef, setSavedRef] = useState("");
  const upcoming = appts.filter((a) => a.status !== "completed");
  const stats = [
    { l: t({ pt: "Sessões realizadas", en: "Sessions completed" }), v: me?.sessions_completed },
    { l: t({ pt: "Pontos", en: "Points" }), v: me?.points },
    { l: t({ pt: "Próximas", en: "Upcoming" }), v: upcoming.length },
    { l: t({ pt: "Verificação", en: "Verification" }), v: "✓" },
  ];
  return (
    <>
      <PageHeader eyebrow={t({ pt: "Painel", en: "Dashboard" })} title={`${t({ pt: "Olá", en: "Hello" })}, ${me?.display_name}`} />
      <div className="container-page space-y-6 py-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => <div key={s.l} className="card"><p className="text-sm text-muted-foreground">{s.l}</p><p className="mt-1 font-display text-3xl font-semibold text-primary">{s.v}</p></div>)}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card">
            <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-semibold">{t({ pt: "Próximas sessões", en: "Upcoming sessions" })}</h2><Link to="/agenda" className="text-sm text-primary">{t({ pt: "Agenda →", en: "Schedule →" })}</Link></div>
            <ul className="divide-y">{upcoming.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                <div><p className="font-semibold">{a.refugee_alias}</p><p className="text-muted-foreground">{fmtDate(a.starts_at, locale)} · {a.language.toUpperCase()}</p></div>
                {a.meet_link ? <a href={a.meet_link} target="_blank" rel="noreferrer" className="btn-primary px-3 py-1.5">Meet</a> : <span className="chip">{t({ pt: "Aguardando", en: "Pending" })}</span>}
              </li>))}
            </ul>
          </section>
          <section className="card">
            <h2 className="mb-3 text-xl font-semibold">{t({ pt: "Histórico de pontos", en: "Points history" })}</h2>
            <ul className="divide-y text-sm">{ledger.map((e) => <li key={e.id} className="flex justify-between py-2"><span>{e.reason.replace(/_/g, " ")}</span><span className="font-semibold text-success">+{e.delta}</span></li>)}</ul>
          </section>
        </div>
        <section className="card space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{t({ pt: "Resumo pós-atendimento (assistido por IA)", en: "Post-session summary (AI-assisted)" })}</h2>
            <p className="text-sm text-muted-foreground">{t({ pt: "A IA apenas organiza suas anotações. Você revisa e decide. O texto final vai para armazenamento externo seguro; a plataforma guarda só uma referência.", en: "AI only structures your notes. You review and decide. Final text goes to secure external storage; the platform keeps only a reference." })}</p>
          </div>
          <textarea rows={4} className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t({ pt: "Tópicos da sessão, um por linha (sem identificar o paciente)", en: "Session topics, one per line (no patient identifiers)" })} />
          <button className="btn-outline" disabled={!notes} onClick={async () => setDraft(await ai.draftSessionSummary(notes))}>{t({ pt: "Gerar rascunho", en: "Generate draft" })}</button>
          {draft && (
            <>
              <textarea rows={7} className="input font-mono text-xs" value={draft} onChange={(e) => setDraft(e.target.value)} />
              <button className="btn-primary" onClick={async () => setSavedRef((await clinicalStore.putNote("a3", draft)).ref)}>{t({ pt: "Revisei — salvar com segurança", en: "Reviewed — save securely" })}</button>
            </>
          )}
          {savedRef && <p className="notice">{t({ pt: "Salvo (mock). Referência:", en: "Saved (mock). Reference:" })} <code>{savedRef}</code></p>}
        </section>
      </div>
    </>
  );
}
