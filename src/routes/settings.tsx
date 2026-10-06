import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/Layout";
import { LOCALES, useLocale, useT, type Locale } from "@/lib/i18n";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [
    { title: "Privacidade e consentimento — Solace Stream Global" },
    { name: "description", content: "Gerencie consentimentos, idioma, exportação e exclusão de dados (LGPD/GDPR)." },
    { property: "og:title", content: "Privacidade e consentimento — Solace Stream Global" },
    { property: "og:description", content: "Gerencie consentimentos, idioma, exportação e exclusão de dados (LGPD/GDPR)." }, { name: "twitter:title", content: "Privacidade e consentimento — Solace Stream Global" }, { name: "twitter:description", content: "Gerencie consentimentos, idioma, exportação e exclusão de dados (LGPD/GDPR)." },
  ] }),
  component: Settings,
});

function Settings() {
  const t = useT();
  const { locale, setLocale } = useLocale();
  const [c, setC] = useState({ platform: true, ai_triage: true, ai_summary: false, ranking_public: true, research: false });
  const items: { k: keyof typeof c; l: { pt: string; en: string }; d: { pt: string; en: string }; required?: boolean }[] = [
    { k: "platform", required: true, l: { pt: "Uso da plataforma", en: "Platform use" }, d: { pt: "Dados mínimos necessários para conta e agendamento.", en: "Minimum data needed for account and scheduling." } },
    { k: "ai_triage", l: { pt: "Orientação inicial por IA", en: "AI initial guidance" }, d: { pt: "Usar suas respostas para sugerir profissionais. Não é diagnóstico.", en: "Use your answers to suggest professionals. Not a diagnosis." } },
    { k: "ai_summary", l: { pt: "Resumo assistido por IA", en: "AI-assisted summary" }, d: { pt: "Permitir que seu psicólogo use IA para estruturar anotações, com revisão humana.", en: "Allow your psychologist to use AI to structure notes, with human review." } },
    { k: "ranking_public", l: { pt: "Aparecer no ranking (psicólogos)", en: "Appear on leaderboard (psychologists)" }, d: { pt: "Nome de exibição e pontos visíveis publicamente.", en: "Display name and points shown publicly." } },
    { k: "research", l: { pt: "Pesquisa anonimizada", en: "Anonymized research" }, d: { pt: "Dados agregados e anônimos para melhorar o programa.", en: "Aggregated, anonymous data to improve the program." } },
  ];
  return (
    <>
      <PageHeader eyebrow={t({ pt: "Configurações", en: "Settings" })} title={t({ pt: "Privacidade e consentimento", en: "Privacy & consent" })}>
        {t({ pt: "Você decide. Pode mudar qualquer consentimento a qualquer momento.", en: "You decide. Change any consent at any time." })}
      </PageHeader>
      <div className="container-page grid max-w-4xl gap-6 py-8">
        <section className="card divide-y p-0">
          {items.map((i) => (
            <label key={i.k} className="flex cursor-pointer items-start justify-between gap-4 p-5">
              <div><p className="font-semibold">{t(i.l)}{i.required && <span className="ml-2 chip">{t({ pt: "obrigatório", en: "required" })}</span>}</p><p className="text-sm text-muted-foreground">{t(i.d)}</p></div>
              <input type="checkbox" className="mt-1 h-5 w-5 accent-primary" checked={c[i.k]} disabled={i.required} onChange={(e) => setC({ ...c, [i.k]: e.target.checked })} />
            </label>
          ))}
        </section>
        <section className="card grid gap-4 sm:grid-cols-2">
          <div><label className="label">{t({ pt: "Idioma", en: "Language" })}</label><select className="input" value={locale} onChange={(e) => setLocale(e.target.value as Locale)}>{LOCALES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}</select></div>
          <div className="flex items-end gap-2">
            <button className="btn-outline flex-1">{t({ pt: "Exportar meus dados", en: "Export my data" })}</button>
            <button className="btn-emergency flex-1">{t({ pt: "Excluir conta", en: "Delete account" })}</button>
          </div>
        </section>
        <p className="text-xs text-muted-foreground">{t({ pt: "Registros clínicos nunca ficam na plataforma: são mantidos em armazenamento externo seguro, acessível apenas ao seu psicólogo, com registro de acesso.", en: "Clinical records never live on the platform: they're kept in secure external storage, accessible only to your psychologist, with access logging." })}</p>
      </div>
    </>
  );
}
