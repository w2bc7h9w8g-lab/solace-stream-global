import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/Layout";
import { PsychologistCard } from "@/components/PsychologistCard";
import { useLocale, useT } from "@/lib/i18n";
import { repo, type PsychologistFilters } from "@/lib/data/repository";
import { languages, specialties } from "@/lib/mock-data";

export const Route = createFileRoute("/psychologists/")({
  head: () => ({ meta: [
    { title: "Encontrar psicólogo — Programa Refugiados UNESCO" },
    { name: "description", content: "Busque psicólogos voluntários verificados por idioma, especialidade e disponibilidade." },
    { property: "og:title", content: "Encontrar psicólogo voluntário" },
    { property: "og:description", content: "Filtre por idioma, especialidade e disponibilidade." },
  ] }),
  component: Search,
});

function Search() {
  const t = useT();
  const { locale } = useLocale();
  const [f, setF] = useState<PsychologistFilters>({});
  const { data = [] } = useQuery({ queryKey: ["psychologists", f], queryFn: () => repo.listPsychologists(f) });
  const set = (k: keyof PsychologistFilters, v: string) => setF({ ...f, [k]: v ? (k === "availableWithinDays" ? Number(v) : v) : undefined });
  return (
    <>
      <PageHeader eyebrow={t({ pt: "Busca", en: "Search" })} title={t({ pt: "Encontre quem fala a sua língua", en: "Find someone who speaks your language" })}>
        {t({ pt: "Todos os profissionais listados passaram por verificação. O atendimento é gratuito e online.", en: "All listed professionals are verified. Sessions are free and online." })}
      </PageHeader>
      <div className="container-page py-8">
        <div className="card mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input className="input lg:col-span-2" placeholder={t({ pt: "Buscar por nome, região…", en: "Search name, region…" })} onChange={(e) => set("q", e.target.value)} aria-label="search" />
          <select className="input" onChange={(e) => set("language", e.target.value)} aria-label="language">
            <option value="">{t({ pt: "Qualquer idioma", en: "Any language" })}</option>
            {languages.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
          <select className="input" onChange={(e) => set("specialty", e.target.value)} aria-label="specialty">
            <option value="">{t({ pt: "Qualquer especialidade", en: "Any specialty" })}</option>
            {specialties.map((s) => <option key={s.slug} value={s.slug}>{s.name[locale]}</option>)}
          </select>
          <select className="input" onChange={(e) => set("availableWithinDays", e.target.value)} aria-label="availability">
            <option value="">{t({ pt: "Qualquer data", en: "Any time" })}</option>
            <option value="2">{t({ pt: "Próximas 48h", en: "Next 48h" })}</option>
            <option value="7">{t({ pt: "Esta semana", en: "This week" })}</option>
          </select>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">{data.length} {t({ pt: "profissionais encontrados", en: "professionals found" })}</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{data.map((p) => <PsychologistCard key={p.id} p={p} />)}</div>
      </div>
    </>
  );
}
