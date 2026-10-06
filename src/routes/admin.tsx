import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/Layout";
import { fmtDate } from "@/components/PsychologistCard";
import { useLocale, useT } from "@/lib/i18n";
import { repo } from "@/lib/data/repository";
import { ai } from "@/lib/integrations";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Moderação e administração — Solace Stream Global" },
    { name: "description", content: "Fila de verificação, solicitações de suporte, moderação assistida e auditoria." },
    { property: "og:title", content: "Área administrativa" },
    { property: "og:description", content: "Moderação e auditoria da plataforma." },
  ] }),
  loader: async () => ({ ver: await repo.listVerifications(), sup: await repo.listSupportRequests(), audit: await repo.listAuditEvents() }),
  component: Admin,
});

function Admin() {
  const data = Route.useLoaderData();
  const t = useT();
  const { locale } = useLocale();
  const [ver, setVer] = useState(data.ver);
  const [post, setPost] = useState("");
  const [mod, setMod] = useState<null | { flagged: boolean; reasons: string[] }>(null);
  const decide = (id: string, status: "verified" | "rejected") => setVer((v) => v.map((x) => (x.psychologist_id === id ? { ...x, status } : x)));
  return (
    <>
      <PageHeader eyebrow="Admin" title={t({ pt: "Moderação e administração", en: "Moderation & administration" })}>
        {t({ pt: "Acesso restrito a moderadores e administradores. Toda ação gera registro de auditoria.", en: "Restricted to moderators and admins. Every action is audit-logged." })}
      </PageHeader>
      <div className="container-page grid gap-6 py-8 lg:grid-cols-2">
        <section className="card lg:col-span-2">
          <h2 className="mb-3 text-xl font-semibold">{t({ pt: "Fila de verificação", en: "Verification queue" })}</h2>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="text-left text-muted-foreground"><tr><th className="py-2">ID</th><th>{t({ pt: "Conselho", en: "Council" })}</th><th>{t({ pt: "Registro", en: "Reg." })}</th><th>{t({ pt: "Antecedentes", en: "Background" })}</th><th>Status</th><th /></tr></thead>
            <tbody className="divide-y">{ver.map((v) => (
              <tr key={v.psychologist_id}>
                <td className="py-2">{v.psychologist_id}</td><td>{v.council}</td><td className="font-mono">{v.registration_masked}</td><td>{v.background_check}</td>
                <td><span className="chip">{v.status}</span></td>
                <td className="space-x-2 text-right">{v.status === "pending" && <>
                  <button className="btn-primary px-2 py-1 text-xs" onClick={() => decide(v.psychologist_id, "verified")}>{t({ pt: "Aprovar", en: "Approve" })}</button>
                  <button className="btn-outline px-2 py-1 text-xs" onClick={() => decide(v.psychologist_id, "rejected")}>{t({ pt: "Recusar", en: "Reject" })}</button></>}
                </td>
              </tr>))}
            </tbody>
          </table></div>
        </section>
        <section className="card">
          <h2 className="mb-3 text-xl font-semibold">{t({ pt: "Solicitações de suporte", en: "Support requests" })}</h2>
          <ul className="divide-y text-sm">{data.sup.map((s) => (
            <li key={s.id} className="flex items-start justify-between gap-3 py-2">
              <div><p className="font-semibold">{s.category}</p><p className="text-muted-foreground">{s.summary}</p></div>
              <span className={`chip ${s.category === "emergency" ? "bg-destructive/15 text-destructive" : ""}`}>{s.status}</span>
            </li>))}
          </ul>
        </section>
        <section className="card space-y-3">
          <h2 className="text-xl font-semibold">{t({ pt: "Moderação de fórum (IA de apoio)", en: "Forum moderation (AI-assisted)" })}</h2>
          <textarea rows={3} className="input" value={post} onChange={(e) => setPost(e.target.value)} placeholder={t({ pt: "Cole um post para pré-análise", en: "Paste a post for pre-screening" })} />
          <button className="btn-outline" onClick={async () => setMod(await ai.moderateForumPost(post))}>{t({ pt: "Pré-analisar", en: "Pre-screen" })}</button>
          {mod && <p className="notice">{mod.flagged ? t({ pt: "Sinalizado para revisão humana prioritária: ", en: "Flagged for priority human review: " }) + mod.reasons.join(", ") : t({ pt: "Nenhum sinal detectado. Decisão final é do moderador.", en: "No signals detected. Final decision rests with the moderator." })}</p>}
        </section>
        <section className="card lg:col-span-2">
          <h2 className="mb-3 text-xl font-semibold">{t({ pt: "Auditoria", en: "Audit log" })}</h2>
          <ul className="divide-y font-mono text-xs">{data.audit.map((e) => <li key={e.id} className="flex flex-wrap gap-x-4 py-2"><span className="text-muted-foreground">{fmtDate(e.created_at, locale)}</span><span>{e.actor}</span><span className="text-primary">{e.action}</span><span>{e.target}</span></li>)}</ul>
        </section>
      </div>
    </>
  );
}
