import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/Layout";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [
    { title: "Suporte e emergência — Solace Stream Global" },
    { name: "description", content: "Encaminhamento para serviços de emergência locais e canais de suporte da plataforma." },
    { property: "og:title", content: "Central de suporte e emergência" },
    { property: "og:description", content: "Onde buscar ajuda imediata." },
  ] }),
  component: Support,
});

// Reference numbers — must be validated per country before production.
const EMERGENCY = [
  { c: "Brasil", n: "192 (SAMU) · 188 (CVV)" }, { c: "Portugal", n: "112 · SNS 24: 808 24 24 24" },
  { c: "União Europeia / EU", n: "112" }, { c: "United States", n: "911 · 988" }, { c: "United Kingdom", n: "999 · 111" },
];

function Support() {
  const t = useT();
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHeader eyebrow={t({ pt: "Suporte", en: "Support" })} title={t({ pt: "Central de suporte e emergência", en: "Support & emergency center" })} />
      <div className="container-page space-y-8 py-8">
        <section id="emergency" className="scroll-mt-24 rounded-2xl border-2 border-destructive bg-destructive/5 p-6 md:p-8">
          <h2 className="text-2xl font-semibold">{t({ pt: "Está em perigo ou pensando em se machucar?", en: "In danger or thinking of hurting yourself?" })}</h2>
          <p className="mt-2 max-w-2xl">{t({ pt: "Esta plataforma NÃO oferece atendimento de emergência. Ligue agora para o serviço local ou vá ao pronto-socorro mais próximo.", en: "This platform does NOT provide emergency care. Call your local service now or go to the nearest emergency room." })}</p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {EMERGENCY.map((e) => <li key={e.c} className="rounded-lg bg-card p-3"><p className="text-xs text-muted-foreground">{e.c}</p><p className="font-display text-lg font-semibold">{e.n}</p></li>)}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">{t({ pt: "Em outro país? Procure o número local de emergência ou a organização de acolhimento mais próxima.", en: "Elsewhere? Look up your local emergency number or nearest reception organization." })}</p>
        </section>
        <section className="card max-w-2xl space-y-4">
          <h2 className="text-xl font-semibold">{t({ pt: "Falar com a equipe da plataforma", en: "Contact the platform team" })}</h2>
          {sent ? <p className="notice">{t({ pt: "Recebido (demo). A moderação responderá em até 48h.", en: "Received (demo). Moderation will reply within 48h." })}</p> : (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div><label className="label">{t({ pt: "Assunto", en: "Topic" })}</label><select className="input">
                <option>{t({ pt: "Segurança / conduta de profissional", en: "Safety / professional conduct" })}</option>
                <option>{t({ pt: "Problema técnico", en: "Technical issue" })}</option>
                <option>{t({ pt: "Privacidade e dados", en: "Privacy & data" })}</option>
                <option>{t({ pt: "Outro", en: "Other" })}</option></select></div>
              <div><label className="label">{t({ pt: "Mensagem", en: "Message" })}</label><textarea required rows={4} className="input" /></div>
              <button className="btn-primary">{t({ pt: "Enviar", en: "Send" })}</button>
            </form>
          )}
        </section>
      </div>
    </>
  );
}
