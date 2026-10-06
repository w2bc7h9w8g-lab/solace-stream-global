import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/Layout";
import { fmtDate } from "@/components/PsychologistCard";
import { useLocale, useT } from "@/lib/i18n";
import { repo } from "@/lib/data/repository";
import { meetProvider } from "@/lib/integrations";
import type { Appointment } from "@/lib/types";

export const Route = createFileRoute("/agenda")({
  head: () => ({ meta: [
    { title: "Agenda e sessões — Solace Stream Global" },
    { name: "description", content: "Gerencie solicitações, sessões confirmadas e links do Google Meet." },
    { property: "og:title", content: "Agenda e sessões — Solace Stream Global" },
    { property: "og:description", content: "Gerencie solicitações, sessões confirmadas e links do Google Meet." }, { name: "twitter:title", content: "Agenda e sessões — Solace Stream Global" }, { name: "twitter:description", content: "Gerencie solicitações, sessões confirmadas e links do Google Meet." },
  ] }),
  loader: () => repo.listAppointments("p1"),
  component: Agenda,
});

const STATUS: Record<Appointment["status"], { pt: string; en: string; c: string }> = {
  requested: { pt: "Solicitada", en: "Requested", c: "bg-warning/20" },
  confirmed: { pt: "Confirmada", en: "Confirmed", c: "bg-success/20" },
  completed: { pt: "Concluída", en: "Completed", c: "bg-muted" },
  cancelled: { pt: "Cancelada", en: "Cancelled", c: "bg-destructive/15" },
};

function Agenda() {
  const initial = Route.useLoaderData();
  const [appts, setAppts] = useState(initial);
  const t = useT();
  const { locale } = useLocale();
  const confirm = async (a: Appointment) => {
    const { url } = await meetProvider.createMeeting(a.id, a.starts_at);
    setAppts((xs) => xs.map((x) => (x.id === a.id ? { ...x, status: "confirmed", meet_link: url } : x)));
  };
  return (
    <>
      <PageHeader eyebrow={t({ pt: "Agenda", en: "Schedule" })} title={t({ pt: "Sessões", en: "Sessions" })}>
        {t({ pt: "Ao confirmar, um link do Google Meet é gerado (integração simulada nesta versão).", en: "Confirming generates a Google Meet link (simulated integration in this version)." })}
      </PageHeader>
      <div className="container-page py-8">
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left"><tr>
              <th className="p-3">{t({ pt: "Data", en: "Date" })}</th><th className="p-3">{t({ pt: "Pessoa", en: "Person" })}</th>
              <th className="p-3">{t({ pt: "Idioma", en: "Lang" })}</th><th className="p-3">Status</th><th className="p-3" />
            </tr></thead>
            <tbody className="divide-y">{appts.map((a) => (
              <tr key={a.id}>
                <td className="p-3">{fmtDate(a.starts_at, locale)}</td>
                <td className="p-3">{a.refugee_alias}</td>
                <td className="p-3">{a.language.toUpperCase()}</td>
                <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS[a.status].c}`}>{STATUS[a.status][locale]}</span></td>
                <td className="p-3 text-right">
                  {a.status === "requested" && <button className="btn-primary px-3 py-1.5" onClick={() => confirm(a)}>{t({ pt: "Confirmar", en: "Confirm" })}</button>}
                  {a.status === "confirmed" && a.meet_link && <a className="btn-outline px-3 py-1.5" href={a.meet_link} target="_blank" rel="noreferrer">Google Meet</a>}
                  {a.status === "completed" && <span className="text-xs text-muted-foreground">{a.clinical_note_ref ? t({ pt: "Resumo arquivado", en: "Summary archived" }) : t({ pt: "Sem resumo", en: "No summary" })}</span>}
                </td>
              </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
