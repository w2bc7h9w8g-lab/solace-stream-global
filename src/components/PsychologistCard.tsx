import { Link } from "@tanstack/react-router";
import { Avatar } from "./Layout";
import { useLocale, useT } from "@/lib/i18n";
import { languages, specialties } from "@/lib/mock-data";
import type { PsychologistPublic } from "@/lib/types";

export const specName = (slug: string, l: "pt" | "en") => specialties.find((s) => s.slug === slug)?.name[l] ?? slug;
export const langName = (c: string) => languages.find((x) => x.code === c)?.name ?? c;
export const fmtDate = (iso: string, l: string) =>
  new Date(iso).toLocaleString(l === "pt" ? "pt-BR" : "en-GB", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

export function PsychologistCard({ p }: { p: PsychologistPublic }) {
  const t = useT();
  const { locale } = useLocale();
  return (
    <article className="card flex flex-col gap-4">
      <div className="flex gap-4">
        <Avatar initials={p.initials} />
        <div className="min-w-0">
          <h3 className="text-lg font-semibold">{p.display_name}</h3>
          <p className="text-sm text-muted-foreground">{p.region} · {p.years_experience} {t({ pt: "anos", en: "yrs" })}</p>
          <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-success">✓ {t({ pt: "Verificado", en: "Verified" })}</span>
        </div>
      </div>
      <p className="line-clamp-2 text-sm">{p.bio[locale]}</p>
      <div className="flex flex-wrap gap-1.5">{p.specialties.map((s) => <span key={s} className="chip">{specName(s, locale)}</span>)}</div>
      <p className="text-xs text-muted-foreground">{p.languages.map(langName).join(" · ")}</p>
      <div className="mt-auto flex items-center justify-between border-t pt-3">
        <span className="text-xs text-muted-foreground">{t({ pt: "Próximo:", en: "Next:" })} {p.next_slots[0] ? fmtDate(p.next_slots[0], locale) : "—"}</span>
        <Link to="/psychologists/$id" params={{ id: p.id }} className="btn-primary px-3 py-1.5">{t({ pt: "Ver perfil", en: "View profile" })}</Link>
      </div>
    </article>
  );
}
