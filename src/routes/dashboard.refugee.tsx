import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/Layout";
import { langName, specName } from "@/components/PsychologistCard";
import { useLocale, useT } from "@/lib/i18n";
import { ai, type TriageResult } from "@/lib/integrations";
import { languages } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/refugee")({
  head: () => ({ meta: [
    { title: "Minha área — Solace Stream Global" },
    { name: "description", content: "Triagem inicial de orientação, sessões e recomendações de profissionais." },
    { property: "og:title", content: "Área da pessoa refugiada" },
    { property: "og:description", content: "Encontre apoio de forma segura." },
  ] }),
  component: RefugeeDash,
});

function RefugeeDash() {
  const t = useT();
  const { locale } = useLocale();
  const [a, setA] = useState<{ topic: string; distress: string; language: string; text: string }>({ topic: "sleep", distress: "medium", language: "pt", text: "" });
  const [res, setRes] = useState<TriageResult | null>(null);
  const topics = [
    { v: "sleep", l: { pt: "Sono, preocupação, medo", en: "Sleep, worry, fear" } },
    { v: "loss", l: { pt: "Perdas e saudade", en: "Loss and missing home" } },
    { v: "violence", l: { pt: "Experiências de violência", en: "Experiences of violence" } },
    { v: "family", l: { pt: "Família e relações", en: "Family and relationships" } },
    { v: "adapt", l: { pt: "Adaptação ao novo país", en: "Adapting to a new country" } },
  ];
  return (
    <>
      <PageHeader eyebrow={t({ pt: "Minha área", en: "My area" })} title={t({ pt: "Bem-vindo(a). Vamos encontrar apoio.", en: "Welcome. Let's find support." })} />
      <div className="container-page grid gap-6 py-8 lg:grid-cols-[1fr_20rem]">
        <section className="card space-y-4">
          <h2 className="text-xl font-semibold">{t({ pt: "Orientação inicial", en: "Initial guidance" })}</h2>
          <p className="notice">{t({ pt: "Estas perguntas ajudam a sugerir profissionais. Não são diagnóstico, e um psicólogo sempre fará a avaliação.", en: "These questions help suggest professionals. They are not a diagnosis; a psychologist always does the assessment." })}</p>
          <div><p className="label">{t({ pt: "O que mais te incomoda agora?", en: "What troubles you most right now?" })}</p>
            <div className="grid gap-2 sm:grid-cols-2">{topics.map((x) => <button key={x.v} onClick={() => setA({ ...a, topic: x.v })} className={`rounded-lg border p-3 text-left text-sm ${a.topic === x.v ? "border-primary bg-secondary font-semibold" : ""}`}>{t(x.l)}</button>)}</div></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">{t({ pt: "Intensidade", en: "Intensity" })}</label><select className="input" value={a.distress} onChange={(e) => setA({ ...a, distress: e.target.value })}><option value="low">{t({ pt: "Leve", en: "Mild" })}</option><option value="medium">{t({ pt: "Moderada", en: "Moderate" })}</option><option value="high">{t({ pt: "Forte", en: "Severe" })}</option></select></div>
            <div><label className="label">{t({ pt: "Idioma preferido", en: "Preferred language" })}</label><select className="input" value={a.language} onChange={(e) => setA({ ...a, language: e.target.value })}>{languages.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}</select></div>
          </div>
          <div><label className="label">{t({ pt: "Quer contar algo mais? (opcional)", en: "Anything else? (optional)" })}</label><textarea className="input" rows={3} value={a.text} onChange={(e) => setA({ ...a, text: e.target.value })} /></div>
          <button className="btn-primary" onClick={async () => setRes(await ai.triage(a))}>{t({ pt: "Ver sugestões", en: "See suggestions" })}</button>
          {res?.urgency === "crisis_signals" && (
            <div className="rounded-lg border-2 border-destructive bg-destructive/10 p-4">
              <p className="font-semibold">{t({ pt: "Percebemos que você pode estar em sofrimento intenso.", en: "It sounds like you may be in intense distress." })}</p>
              <p className="mt-1 text-sm">{t({ pt: "Procure agora o serviço de emergência local. Você não está sozinho(a).", en: "Please contact your local emergency service now. You are not alone." })}</p>
              <Link to="/support" hash="emergency" className="btn-emergency mt-3">{t({ pt: "Ver contatos de emergência", en: "See emergency contacts" })}</Link>
            </div>
          )}
          {res && res.urgency !== "crisis_signals" && (
            <div className="rounded-lg bg-secondary p-4 text-sm">
              <p>{t({ pt: "Sugerimos profissionais em:", en: "We suggest professionals in:" })} <b>{res.suggestedSpecialties.map((s) => specName(s, locale)).join(", ")}</b> · <b>{res.suggestedLanguages.map(langName).join(", ")}</b></p>
              <Link to="/psychologists" className="btn-primary mt-3">{t({ pt: "Ver profissionais", en: "View professionals" })}</Link>
              <p className="mt-2 text-xs text-muted-foreground">{res.disclaimer}</p>
            </div>
          )}
        </section>
        <aside className="space-y-4">
          <div className="card"><h3 className="font-semibold">{t({ pt: "Minhas sessões", en: "My sessions" })}</h3><p className="mt-2 text-sm text-muted-foreground">{t({ pt: "Nenhuma sessão agendada ainda.", en: "No sessions booked yet." })}</p></div>
          <div className="card"><h3 className="font-semibold">{t({ pt: "Sua privacidade", en: "Your privacy" })}</h3><p className="mt-2 text-sm text-muted-foreground">{t({ pt: "Os psicólogos veem apenas um código anônimo, até você decidir compartilhar mais.", en: "Psychologists only see an anonymous code until you choose to share more." })}</p><Link to="/settings" className="mt-2 inline-block text-sm text-primary">{t({ pt: "Gerenciar →", en: "Manage →" })}</Link></div>
        </aside>
      </div>
    </>
  );
}
