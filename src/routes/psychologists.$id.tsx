import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Avatar } from "@/components/Layout";
import { fmtDate, langName, specName } from "@/components/PsychologistCard";
import { useLocale, useT } from "@/lib/i18n";
import { repo } from "@/lib/data/repository";

export const Route = createFileRoute("/psychologists/$id")({
  loader: async ({ params }) => {
    const p = await repo.getPsychologist(params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.display_name ?? "Perfil"} — Programa Refugiados UNESCO` },
    { name: "description", content: loaderData?.bio.pt ?? "Perfil de psicólogo voluntário." },
    { property: "og:title", content: loaderData?.display_name ?? "Perfil" },
    { property: "og:description", content: loaderData?.bio.pt ?? "" },
  ] }),
  notFoundComponent: () => <div className="container-page py-20 text-center">Perfil não encontrado.</div>,
  errorComponent: () => <div className="container-page py-20 text-center">Erro ao carregar perfil.</div>,
  component: Profile,
});

function Profile() {
  const p = Route.useLoaderData();
  const t = useT();
  const { locale } = useLocale();
  const [slot, setSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-6">
        <div className="flex items-center gap-5">
          <Avatar initials={p.initials} size="lg" />
          <div>
            <h1 className="text-3xl font-semibold">{p.display_name}</h1>
            <p className="text-muted-foreground">{p.region} · {p.years_experience} {t({ pt: "anos de experiência", en: "years of experience" })}</p>
            <span className="mt-1 inline-flex text-sm font-semibold text-success">✓ {t({ pt: "Registro profissional verificado", en: "Professional registration verified" })}</span>
          </div>
        </div>
        <section className="card"><h2 className="mb-2 text-xl font-semibold">{t({ pt: "Sobre", en: "About" })}</h2><p>{p.bio[locale]}</p></section>
        <section className="card grid gap-5 sm:grid-cols-2">
          <div><h3 className="label">{t({ pt: "Especialidades", en: "Specialties" })}</h3><div className="flex flex-wrap gap-1.5">{p.specialties.map((s) => <span key={s} className="chip">{specName(s, locale)}</span>)}</div></div>
          <div><h3 className="label">{t({ pt: "Idiomas", en: "Languages" })}</h3><div className="flex flex-wrap gap-1.5">{p.languages.map((l) => <span key={l} className="chip-accent">{langName(l)}</span>)}</div></div>
          <div><h3 className="label">{t({ pt: "Contribuição", en: "Contribution" })}</h3><p className="text-sm">{p.sessions_completed} {t({ pt: "sessões", en: "sessions" })} · {p.points} pts</p></div>
          <div><h3 className="label">{t({ pt: "Modalidade", en: "Modality" })}</h3><p className="text-sm">Online · Google Meet</p></div>
        </section>
      </div>
      <aside className="card h-fit space-y-4 lg:sticky lg:top-24">
        <h2 className="text-xl font-semibold">{t({ pt: "Agendar sessão", en: "Book a session" })}</h2>
        {booked ? (
          <div className="space-y-3">
            <p className="notice">{t({ pt: "Solicitação enviada (demo). O link do Google Meet aparecerá após confirmação.", en: "Request sent (demo). The Google Meet link will appear after confirmation." })}</p>
            <Link to="/dashboard/refugee" className="btn-outline w-full">{t({ pt: "Ir para minha área", en: "Go to my area" })}</Link>
          </div>
        ) : (
          <>
            <div className="grid gap-2">
              {p.next_slots.map((s) => (
                <button key={s} onClick={() => setSlot(s)} className={`rounded-lg border p-3 text-left text-sm ${slot === s ? "border-primary bg-secondary font-semibold" : ""}`}>{fmtDate(s, locale)}</button>
              ))}
            </div>
            <button disabled={!slot} onClick={() => setBooked(true)} className="btn-primary w-full">{t({ pt: "Solicitar horário", en: "Request slot" })}</button>
            <p className="text-xs text-muted-foreground">{t({ pt: "Não é serviço de emergência. Em risco imediato, use “Ajuda urgente”.", en: "Not an emergency service. If in immediate danger, use “Urgent help”." })}</p>
          </>
        )}
      </aside>
    </div>
  );
}
