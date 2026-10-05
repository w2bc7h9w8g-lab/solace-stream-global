import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/Layout";
import { useLocale, useT } from "@/lib/i18n";
import { languages, specialties } from "@/lib/mock-data";

export const Route = createFileRoute("/psychologist/onboarding")({
  head: () => ({ meta: [
    { title: "Cadastro de psicólogo voluntário — Programa Refugiados UNESCO" },
    { name: "description", content: "Cadastro em etapas: dados profissionais, especialidades, idiomas, disponibilidade e formação." },
    { property: "og:title", content: "Seja psicólogo voluntário" },
    { property: "og:description", content: "Junte-se à rede de apoio psicológico para pessoas refugiadas." },
  ] }),
  component: Onboarding,
});

const POPULATIONS = [
  { v: "children", pt: "Crianças", en: "Children" }, { v: "adolescents", pt: "Adolescentes", en: "Adolescents" },
  { v: "adults", pt: "Adultos", en: "Adults" }, { v: "women", pt: "Mulheres", en: "Women" },
  { v: "families", pt: "Famílias", en: "Families" }, { v: "lgbtqia", pt: "LGBTQIA+", en: "LGBTQIA+" },
];
const DAYS = { pt: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"], en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] };

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} aria-pressed={on} className={`rounded-full border px-3 py-1.5 text-sm ${on ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{children}</button>;
}

function Onboarding() {
  const t = useT();
  const { locale } = useLocale();
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<Record<string, string[]>>({ spec: [], lang: [], pop: [], days: [], interests: [] });
  const tog = (k: string, v: string) => setSel((s) => ({ ...s, [k]: s[k].includes(v) ? s[k].filter((x) => x !== v) : [...s[k], v] }));
  const steps = [
    t({ pt: "Dados básicos", en: "Basics" }), t({ pt: "Especialidades", en: "Specialties" }), t({ pt: "Idiomas e públicos", en: "Languages & populations" }),
    t({ pt: "Disponibilidade", en: "Availability" }), t({ pt: "Formação", en: "Training" }), t({ pt: "Verificação", en: "Verification" }),
  ];
  return (
    <>
      <PageHeader eyebrow={t({ pt: "Voluntariado", en: "Volunteer" })} title={t({ pt: "Cadastro de psicólogo(a)", en: "Psychologist registration" })}>
        {t({ pt: "Leva cerca de 10 minutos. Dados sensíveis são usados apenas para verificação e nunca aparecem no perfil público.", en: "About 10 minutes. Sensitive data is used only for verification and never shown publicly." })}
      </PageHeader>
      <div className="container-page max-w-3xl py-8">
        <ol className="mb-8 flex gap-1" aria-label="Progress">
          {steps.map((s, i) => (
            <li key={s} className="flex-1">
              <div className={`h-1.5 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
              <p className={`mt-2 hidden text-xs sm:block ${i === step ? "font-semibold" : "text-muted-foreground"}`}>{s}</p>
            </li>
          ))}
        </ol>
        <div className="card space-y-5 p-6">
          <h2 className="text-2xl font-semibold">{steps[step]}</h2>
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">{t({ pt: "Nome de exibição", en: "Display name" })}</label><input className="input" placeholder="Dra. Ana S." /></div>
              <div><label className="label">{t({ pt: "Região ampla", en: "Broad region" })}</label><input className="input" placeholder="América do Sul" /></div>
              <div><label className="label">{t({ pt: "Anos de experiência", en: "Years of experience" })}</label><input type="number" min={0} className="input" /></div>
              <div><label className="label">{t({ pt: "Fuso horário", en: "Time zone" })}</label><input className="input" defaultValue="America/Sao_Paulo" /></div>
              <div className="sm:col-span-2"><label className="label">Bio</label><textarea rows={4} className="input" placeholder={t({ pt: "Abordagem, experiência com populações deslocadas…", en: "Approach, experience with displaced people…" })} /></div>
            </div>
          )}
          {step === 1 && <div className="flex flex-wrap gap-2">{specialties.map((s) => <Toggle key={s.slug} on={sel.spec.includes(s.slug)} onClick={() => tog("spec", s.slug)}>{s.name[locale]}</Toggle>)}</div>}
          {step === 2 && (
            <>
              <div><p className="label">{t({ pt: "Idiomas de atendimento", en: "Session languages" })}</p><div className="flex flex-wrap gap-2">{languages.map((l) => <Toggle key={l.code} on={sel.lang.includes(l.code)} onClick={() => tog("lang", l.code)}>{l.name}</Toggle>)}</div></div>
              <div><p className="label">{t({ pt: "Populações atendidas", en: "Populations served" })}</p><div className="flex flex-wrap gap-2">{POPULATIONS.map((p) => <Toggle key={p.v} on={sel.pop.includes(p.v)} onClick={() => tog("pop", p.v)}>{p[locale]}</Toggle>)}</div></div>
            </>
          )}
          {step === 3 && (
            <>
              <div className="flex flex-wrap gap-2">{DAYS[locale].map((d, i) => <Toggle key={d} on={sel.days.includes(String(i))} onClick={() => tog("days", String(i))}>{d}</Toggle>)}</div>
              <div className="grid grid-cols-2 gap-4"><div><label className="label">{t({ pt: "Início", en: "Start" })}</label><input type="time" defaultValue="09:00" className="input" /></div><div><label className="label">{t({ pt: "Fim", en: "End" })}</label><input type="time" defaultValue="12:00" className="input" /></div></div>
              <div><label className="label">{t({ pt: "Horas por semana", en: "Hours per week" })}</label><input type="number" defaultValue={3} className="input" /></div>
            </>
          )}
          {step === 4 && (
            <>
              <p className="text-sm text-muted-foreground">{t({ pt: "Indique áreas de interesse em especialização. Instituições podem oferecer bolsas de até 15%, conforme regras próprias.", en: "Select areas of interest for further study. Institutions may offer scholarships up to 15% under their own rules." })}</p>
              <div className="flex flex-wrap gap-2">{["Trauma", "Saúde mental global", "Psicologia intercultural", "Infância", "Neuropsicologia"].map((x) => <Toggle key={x} on={sel.interests.includes(x)} onClick={() => tog("interests", x)}>{x}</Toggle>)}</div>
            </>
          )}
          {step === 5 && (
            <div className="space-y-3">
              <p className="text-muted-foreground">{t({ pt: "Próximo passo: verificação profissional e de segurança. Seu perfil fica oculto até ser aprovado.", en: "Next: professional and safety verification. Your profile stays hidden until approved." })}</p>
              <Link to="/verification" className="btn-primary">{t({ pt: "Ir para verificação", en: "Go to verification" })}</Link>
            </div>
          )}
          <div className="flex justify-between border-t pt-5">
            <button className="btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>← {t({ pt: "Voltar", en: "Back" })}</button>
            {step < steps.length - 1 && <button className="btn-primary" onClick={() => setStep(step + 1)}>{t({ pt: "Continuar", en: "Continue" })} →</button>}
          </div>
        </div>
      </div>
    </>
  );
}
