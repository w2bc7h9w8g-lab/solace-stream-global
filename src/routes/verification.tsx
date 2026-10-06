import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/Layout";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/verification")({
  head: () => ({ meta: [
    { title: "Verificação profissional — Solace Stream Global" },
    { name: "description", content: "Envio seguro de registro profissional, identidade e checagem de segurança para psicólogos." },
    { property: "og:title", content: "Verificação profissional — Solace Stream Global" },
    { property: "og:description", content: "Envio seguro de registro profissional, identidade e checagem de segurança para psicólogos." }, { name: "twitter:title", content: "Verificação profissional — Solace Stream Global" }, { name: "twitter:description", content: "Envio seguro de registro profissional, identidade e checagem de segurança para psicólogos." },
  ] }),
  component: Verification,
});

function Verification() {
  const t = useT();
  const [submitted, setSubmitted] = useState(false);
  const statuses = [
    { k: "pending", l: { pt: "Pendente", en: "Pending" }, c: "bg-warning" },
    { k: "verified", l: { pt: "Verificado", en: "Verified" }, c: "bg-success" },
    { k: "rejected", l: { pt: "Recusado", en: "Rejected" }, c: "bg-destructive" },
  ];
  return (
    <>
      <PageHeader eyebrow={t({ pt: "Segurança", en: "Safety" })} title={t({ pt: "Verificação profissional", en: "Professional verification" })}>
        {t({ pt: "Documentos são enviados a um armazenamento externo seguro. A plataforma guarda apenas o status e uma referência — nunca o documento.", en: "Documents go to secure external storage. The platform keeps only the status and a reference — never the document." })}
      </PageHeader>
      <div className="container-page grid max-w-5xl gap-6 py-8 md:grid-cols-[1fr_18rem]">
        <form className="card space-y-5 p-6" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          <h2 className="text-xl font-semibold">{t({ pt: "Registro no conselho", en: "Council registration" })}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">{t({ pt: "Conselho / país", en: "Council / country" })}</label><select className="input"><option>CRP — Brasil</option><option>Other / Outro</option></select></div>
            <div><label className="label">{t({ pt: "Nº de registro", en: "Registration no." })}</label><input required className="input" placeholder="06/123456" autoComplete="off" /></div>
          </div>
          <h2 className="text-xl font-semibold">{t({ pt: "Identidade", en: "Identity" })}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">{t({ pt: "Nome legal completo", en: "Full legal name" })}</label><input required className="input" /></div>
            <div><label className="label">{t({ pt: "Documento (envio seguro)", en: "ID document (secure upload)" })}</label><input type="file" className="input" accept="image/*,application/pdf" /></div>
          </div>
          <label className="flex gap-2 text-sm"><input type="checkbox" required />{t({ pt: "Autorizo a checagem de antecedentes e a validação junto ao conselho profissional, exclusivamente para fins de segurança.", en: "I authorize a background check and validation with my professional council, solely for safety purposes." })}</label>
          <label className="flex gap-2 text-sm"><input type="checkbox" required />{t({ pt: "Aceito o código de conduta e a política de proteção de pessoas vulneráveis.", en: "I accept the code of conduct and safeguarding policy." })}</label>
          {submitted ? <p className="notice">{t({ pt: "Enviado (demonstração). Status: pendente. Você será avisado após revisão humana.", en: "Submitted (demo). Status: pending. You'll be notified after human review." })}</p>
            : <button className="btn-primary">{t({ pt: "Enviar para verificação", en: "Submit for verification" })}</button>}
        </form>
        <aside className="card h-fit space-y-4">
          <h3 className="font-semibold">{t({ pt: "Status possíveis", en: "Possible statuses" })}</h3>
          {statuses.map((s) => <div key={s.k} className="flex items-center gap-2 text-sm"><span className={`h-2.5 w-2.5 rounded-full ${s.c}`} />{t(s.l)}</div>)}
          <p className="border-t pt-4 text-xs text-muted-foreground">{t({ pt: "Somente administradores de verificação acessam os dados, com registro em auditoria. Público vê apenas o selo “Verificado”.", en: "Only verification admins access data, with audit logging. The public sees only a “Verified” badge." })}</p>
        </aside>
      </div>
    </>
  );
}
