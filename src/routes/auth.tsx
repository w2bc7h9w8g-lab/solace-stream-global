import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useT } from "@/lib/i18n";
import type { AppRole } from "@/lib/types";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Entrar ou cadastrar — Solace Stream Global" },
    { name: "description", content: "Acesse ou crie sua conta como pessoa refugiada, psicólogo voluntário ou parceiro." },
    { property: "og:title", content: "Entrar — Solace Stream Global" },
    { property: "og:description", content: "Acesso seguro à plataforma de apoio psicológico." },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const t = useT();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [role, setRole] = useState<AppRole>("refugee");
  const [done, setDone] = useState(false);
  const roles: { v: AppRole; l: { pt: string; en: string } }[] = [
    { v: "refugee", l: { pt: "Busco apoio", en: "I seek support" } },
    { v: "psychologist", l: { pt: "Psicólogo(a)", en: "Psychologist" } },
    { v: "university_partner", l: { pt: "Instituição parceira", en: "Partner institution" } },
  ];
  return (
    <div className="container-page flex justify-center py-12">
      <div className="card w-full max-w-md p-7">
        <div className="mb-6 grid grid-cols-2 rounded-lg bg-muted p-1">
          {(["in", "up"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`rounded-md py-2 text-sm font-semibold ${mode === m ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
              {m === "in" ? t({ pt: "Entrar", en: "Sign in" }) : t({ pt: "Criar conta", en: "Sign up" })}
            </button>
          ))}
        </div>
        {done ? (
          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-semibold">{t({ pt: "Modo demonstração", en: "Demo mode" })}</h1>
            <p className="text-sm text-muted-foreground">{t({ pt: "A autenticação real será ativada ao conectar o backend. Explore as áreas:", en: "Real authentication activates once the backend is connected. Explore the areas:" })}</p>
            <div className="grid gap-2">
              <Link to="/dashboard/refugee" className="btn-outline">{t({ pt: "Área do refugiado", en: "Refugee area" })}</Link>
              <Link to={role === "psychologist" ? "/psychologist/onboarding" : "/dashboard/psychologist"} className="btn-primary">{t({ pt: "Área do psicólogo", en: "Psychologist area" })}</Link>
            </div>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
            {mode === "up" && (
              <fieldset>
                <legend className="label">{t({ pt: "Eu sou", en: "I am" })}</legend>
                <div className="grid gap-2 sm:grid-cols-3">
                  {roles.map((r) => (
                    <button type="button" key={r.v} onClick={() => setRole(r.v)} className={`rounded-lg border p-2 text-xs font-semibold ${role === r.v ? "border-primary bg-secondary" : ""}`}>{t(r.l)}</button>
                  ))}
                </div>
              </fieldset>
            )}
            {mode === "up" && role === "refugee" && (
              <p className="notice">{t({ pt: "Você pode usar um apelido. Não pedimos documentos de refúgio.", en: "You may use a nickname. We never ask for refugee documents." })}</p>
            )}
            <div><label className="label" htmlFor="email">E-mail</label><input id="email" type="email" required className="input" /></div>
            <div><label className="label" htmlFor="pw">{t({ pt: "Senha", en: "Password" })}</label><input id="pw" type="password" required minLength={8} className="input" /></div>
            {mode === "up" && (
              <label className="flex gap-2 text-sm"><input type="checkbox" required /> {t({ pt: "Li e aceito a política de privacidade e o tratamento mínimo de dados (LGPD).", en: "I accept the privacy policy and minimal data processing (GDPR/LGPD)." })}</label>
            )}
            <button className="btn-primary w-full">{mode === "in" ? t({ pt: "Entrar", en: "Sign in" }) : t({ pt: "Criar conta", en: "Create account" })}</button>
            <button type="button" className="btn-outline w-full" onClick={() => setDone(true)}>{t({ pt: "Continuar com Google", en: "Continue with Google" })}</button>
          </form>
        )}
      </div>
    </div>
  );
}
