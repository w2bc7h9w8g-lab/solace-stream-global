import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LOCALES, useLocale, useT, type Locale } from "@/lib/i18n";

const NAV = [
  { to: "/psychologists", label: { pt: "Encontrar psicólogo", en: "Find a psychologist" } },
  { to: "/ranking", label: { pt: "Ranking", en: "Leaderboard" } },
  { to: "/partnerships", label: { pt: "Parcerias", en: "Partnerships" } },
  { to: "/support", label: { pt: "Suporte", en: "Support" } },
] as const;

const AREAS = [
  { to: "/dashboard/refugee", label: { pt: "Área do refugiado", en: "Refugee area" } },
  { to: "/dashboard/psychologist", label: { pt: "Área do psicólogo", en: "Psychologist area" } },
  { to: "/agenda", label: { pt: "Agenda", en: "Schedule" } },
  { to: "/admin", label: { pt: "Moderação", en: "Moderation" } },
  { to: "/settings", label: { pt: "Privacidade", en: "Privacy" } },
] as const;

export function EmergencyButton({ compact }: { compact?: boolean }) {
  const t = useT();
  return (
    <Link to="/support" hash="emergency" className="btn-emergency" aria-label={t({ pt: "Ajuda urgente", en: "Urgent help" })}>
      <span aria-hidden className="h-2 w-2 animate-pulse rounded-full bg-destructive-foreground" />
      {compact ? "SOS" : t({ pt: "Ajuda urgente", en: "Urgent help" })}
    </Link>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const t = useT();
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="container-page flex h-16 items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/icon-512.png" alt="" className="h-8 w-8" />
            <span className="font-display text-base font-semibold leading-tight">
              Programa Refugiados <span className="text-primary">UNESCO</span>
            </span>
          </Link>
          <nav className="ml-6 hidden gap-1 lg:flex">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="btn-ghost" activeProps={{ className: "btn-ghost bg-muted" }}>{t(n.label)}</Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <select aria-label="Language" value={locale} onChange={(e) => setLocale(e.target.value as Locale)} className="input w-auto py-1.5">
              {LOCALES.map((l) => <option key={l.code} value={l.code}>{l.code.toUpperCase()}</option>)}
            </select>
            <div className="hidden sm:block"><EmergencyButton /></div>
            <div className="sm:hidden"><EmergencyButton compact /></div>
            <Link to="/auth" className="btn-primary hidden md:inline-flex">{t({ pt: "Entrar", en: "Sign in" })}</Link>
            <button className="btn-ghost lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">☰</button>
          </div>
        </div>
        {open && (
          <nav className="container-page grid gap-1 pb-4 lg:hidden">
            {[...NAV, ...AREAS, { to: "/auth", label: { pt: "Entrar", en: "Sign in" } }].map((n) => (
              <Link key={n.to} to={n.to} className="btn-ghost justify-start" onClick={() => setOpen(false)}>{t(n.label)}</Link>
            ))}
          </nav>
        )}
        <div className="hidden border-t bg-muted/60 lg:block">
          <div className="container-page flex gap-4 py-1.5 text-xs text-muted-foreground">
            <span className="font-semibold">{t({ pt: "Demonstração:", en: "Demo:" })}</span>
            {AREAS.map((a) => <Link key={a.to} to={a.to} className="hover:text-primary" activeProps={{ className: "text-primary font-semibold" }}>{t(a.label)}</Link>)}
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-16 bg-ink text-ink-foreground">
        <div className="container-page grid gap-6 py-10 text-sm md:grid-cols-3">
          <div>
            <p className="font-display text-lg">Solace Stream Global</p>
            <p className="mt-2 opacity-75">{t({ pt: "Projeto conceitual independente. Sem afiliação oficial com a UNESCO, universidades ou conselhos profissionais.", en: "Independent concept project. No official affiliation with UNESCO, universities or professional councils." })}</p>
          </div>
          <p className="opacity-75">{t({ pt: "Esta plataforma não presta atendimento de emergência. Em risco imediato, ligue para o serviço de emergência local.", en: "This platform does not provide emergency care. If in immediate danger, call your local emergency service." })}</p>
          <div className="flex flex-col gap-1">
            <Link to="/settings" className="hover:underline">{t({ pt: "Privacidade e consentimento", en: "Privacy & consent" })}</Link>
            <Link to="/psychologist/onboarding" className="hover:underline">{t({ pt: "Seja voluntário", en: "Volunteer" })}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="border-b bg-secondary/40">
      <div className="container-page py-10">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{title}</h1>
        {children && <div className="mt-3 max-w-2xl text-muted-foreground">{children}</div>}
      </div>
    </div>
  );
}

export function Avatar({ initials, size = "md" }: { initials: string; size?: "md" | "lg" }) {
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full bg-primary font-display font-semibold text-primary-foreground ${size === "lg" ? "h-20 w-20 text-2xl" : "h-12 w-12"}`}>
      {initials}
    </div>
  );
}
