import { createFileRoute } from "@tanstack/react-router";
import { Avatar, PageHeader } from "@/components/Layout";
import { useT } from "@/lib/i18n";
import { repo } from "@/lib/data/repository";

export const Route = createFileRoute("/ranking")({
  head: () => ({ meta: [
    { title: "Ranking de voluntários — Programa Refugiados UNESCO" },
    { name: "description", content: "Reconhecimento público dos psicólogos que mais contribuem, sem dados clínicos." },
    { property: "og:title", content: "Ranking de maiores ajudantes" },
    { property: "og:description", content: "Gamificação e pontos de contribuição voluntária." },
  ] }),
  loader: () => repo.getLeaderboard(),
  component: Ranking,
});

const BADGES: Record<string, { pt: string; en: string }> = {
  "50+": { pt: "50+ sessões", en: "50+ sessions" }, polyglot: { pt: "Poliglota", en: "Polyglot" }, mentor: { pt: "Mentor", en: "Mentor" },
};

function Ranking() {
  const rows = Route.useLoaderData();
  const t = useT();
  const rules = [
    [t({ pt: "Sessão concluída", en: "Completed session" }), "+20"], [t({ pt: "Disponibilidade cumprida", en: "Availability kept" }), "+10"],
    [t({ pt: "Formação concluída", en: "Training completed" }), "+50"], [t({ pt: "Atendimento em idioma raro", en: "Rare-language session" }), "+5"],
  ];
  return (
    <>
      <PageHeader eyebrow={t({ pt: "Reconhecimento", en: "Recognition" })} title={t({ pt: "Maiores ajudantes", en: "Top helpers" })}>
        {t({ pt: "Pontos refletem apenas volume e constância de contribuição. Nenhum dado de pacientes é usado ou exibido.", en: "Points reflect only contribution volume and consistency. No patient data is used or shown." })}
      </PageHeader>
      <div className="container-page grid gap-6 py-8 lg:grid-cols-[1fr_18rem]">
        <ol className="space-y-3">{rows.map((r, i) => (
          <li key={r.psychologist_id} className={`card flex items-center gap-4 ${i < 3 ? "border-accent/50" : ""}`}>
            <span className={`w-8 text-center font-display text-2xl font-semibold ${i < 3 ? "text-accent" : "text-muted-foreground"}`}>{i + 1}</span>
            <Avatar initials={r.initials} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{r.display_name}</p>
              <p className="text-xs text-muted-foreground">{r.region} · {r.sessions} {t({ pt: "sessões", en: "sessions" })}</p>
              <div className="mt-1 flex flex-wrap gap-1">{r.badges.map((b) => <span key={b} className="chip-accent">{t(BADGES[b] ?? { pt: b, en: b })}</span>)}</div>
            </div>
            <p className="font-display text-xl font-semibold text-primary">{r.points.toLocaleString()}<span className="ml-1 text-xs text-muted-foreground">pts</span></p>
          </li>))}
        </ol>
        <aside className="card h-fit space-y-3">
          <h2 className="font-semibold">{t({ pt: "Como ganhar pontos", en: "How to earn points" })}</h2>
          {rules.map(([l, v]) => <div key={l} className="flex justify-between text-sm"><span>{l}</span><span className="font-semibold text-success">{v}</span></div>)}
          <p className="border-t pt-3 text-xs text-muted-foreground">{t({ pt: "Pontos podem compor a elegibilidade a bolsas, mas nunca substituem critérios acadêmicos ou profissionais.", en: "Points may count toward scholarship eligibility but never replace academic or professional criteria." })}</p>
        </aside>
      </div>
    </>
  );
}
