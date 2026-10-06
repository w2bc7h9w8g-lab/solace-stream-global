import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/Layout";
import { useLocale, useT } from "@/lib/i18n";
import { repo } from "@/lib/data/repository";
import { MAX_SCHOLARSHIP_PCT } from "@/lib/types";

export const Route = createFileRoute("/partnerships")({
  head: () => ({ meta: [
    { title: "Universidades e bolsas — Solace Stream Global" },
    { name: "description", content: "Modelo de parceria com instituições de ensino para bolsas de até 15% a psicólogos voluntários." },
    { property: "og:title", content: "Parcerias e oportunidades de bolsa" },
    { property: "og:description", content: "Formação continuada para quem contribui." },
  ] }),
  loader: async () => ({ unis: await repo.listUniversities(), opps: await repo.listScholarships() }),
  component: Partnerships,
});

const MY_POINTS = 1840;

function Partnerships() {
  const { unis, opps } = Route.useLoaderData();
  const t = useT();
  const { locale } = useLocale();
  const [applied, setApplied] = useState<string[]>([]);
  return (
    <>
      <PageHeader eyebrow={t({ pt: "Formação", en: "Education" })} title={t({ pt: "Universidades e oportunidades de bolsa", en: "Universities & scholarship opportunities" })}>
        {t({ pt: `Instituições podem oferecer subsídios de até ${MAX_SCHOLARSHIP_PCT}% a psicólogos voluntários. As instituições abaixo são fictícias, apenas para demonstração.`, en: `Institutions may offer up to ${MAX_SCHOLARSHIP_PCT}% subsidies to volunteer psychologists. Institutions below are fictional, for demo only.` })}
      </PageHeader>
      <div className="container-page space-y-8 py-8">
        <div className="grid gap-5 md:grid-cols-3">
          {opps.map((o) => {
            const u = unis.find((x) => x.id === o.university_id)!;
            const eligible = MY_POINTS >= o.min_points;
            return (
              <article key={o.id} className="card flex flex-col gap-3">
                <span className="chip-accent w-fit">{Math.min(o.discount_pct, MAX_SCHOLARSHIP_PCT)}% {t({ pt: "de subsídio", en: "subsidy" })}</span>
                <h3 className="text-lg font-semibold">{o.program[locale]}</h3>
                <p className="text-sm text-muted-foreground">{u.name} · {u.country}</p>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <div><dt className="text-muted-foreground">{t({ pt: "Pontos mín.", en: "Min. points" })}</dt><dd className="font-semibold">{o.min_points}</dd></div>
                  <div><dt className="text-muted-foreground">{t({ pt: "Vagas", en: "Seats" })}</dt><dd className="font-semibold">{o.seats}</dd></div>
                </dl>
                <button disabled={!eligible || applied.includes(o.id)} onClick={() => setApplied([...applied, o.id])} className="btn-primary mt-auto">
                  {applied.includes(o.id) ? t({ pt: "Interesse registrado", en: "Interest registered" }) : eligible ? t({ pt: "Manifestar interesse", en: "Express interest" }) : t({ pt: "Pontos insuficientes", en: "Not enough points" })}
                </button>
              </article>
            );
          })}
        </div>
        <section className="grid gap-6 rounded-2xl bg-secondary/60 p-6 md:grid-cols-3 md:p-8">
          {[
            { h: { pt: "1. Interesse", en: "1. Interest" }, b: { pt: "O psicólogo indica áreas de especialização desejadas.", en: "Psychologist lists desired specialization areas." } },
            { h: { pt: "2. Elegibilidade", en: "2. Eligibility" }, b: { pt: "Pontos são um dos critérios; a instituição aplica sua seleção acadêmica.", en: "Points are one criterion; the institution applies its own academic selection." } },
            { h: { pt: "3. Subsídio", en: "3. Subsidy" }, b: { pt: `Desconto limitado a ${MAX_SCHOLARSHIP_PCT}%, definido pela instituição parceira.`, en: `Discount capped at ${MAX_SCHOLARSHIP_PCT}%, set by the partner.` } },
          ].map((s) => <div key={s.h.pt}><h3 className="font-semibold">{t(s.h)}</h3><p className="mt-1 text-sm text-muted-foreground">{t(s.b)}</p></div>)}
        </section>
        <p className="text-sm text-muted-foreground">{t({ pt: "É uma instituição de ensino? Cadastre-se como parceira em “Criar conta”.", en: "Are you an institution? Register as a partner under “Sign up”." })}</p>
      </div>
    </>
  );
}
