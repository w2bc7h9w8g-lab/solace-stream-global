import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solace Stream Global — Apoio psicológico voluntário" },
      { name: "description", content: "Plataforma que conecta pessoas refugiadas a psicólogos voluntários verificados, com privacidade desde a concepção." },
      { property: "og:title", content: "Solace Stream Global — Apoio psicológico voluntário" },
      { property: "og:description", content: "Plataforma que conecta pessoas refugiadas a psicólogos voluntários verificados, com privacidade desde a concepção." }, { name: "twitter:title", content: "Solace Stream Global — Apoio psicológico voluntário" }, { name: "twitter:description", content: "Plataforma que conecta pessoas refugiadas a psicólogos voluntários verificados, com privacidade desde a concepção." },
    ],
  }),
  component: Home,
});

function Home() {
  const t = useT();
  const pillars = [
    { n: "01", title: { pt: "Psicólogos verificados", en: "Verified psychologists" }, body: { pt: "Registro profissional, identidade e segurança revisados antes de qualquer atendimento.", en: "Professional registration, identity and safety reviewed before any session." } },
    { n: "02", title: { pt: "No seu idioma", en: "In your language" }, body: { pt: "Filtre por idioma, especialidade e disponibilidade. Sessões online por vídeo.", en: "Filter by language, specialty and availability. Online video sessions." } },
    { n: "03", title: { pt: "Privacidade primeiro", en: "Privacy first" }, body: { pt: "Dados mínimos, consentimento explícito e registros clínicos fora da plataforma.", en: "Minimal data, explicit consent and clinical records kept off-platform." } },
  ];
  return (
    <>
      <section className="container-page grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
        <div>
          <p className="eyebrow">{t({ pt: "Saúde mental sem fronteiras", en: "Mental health without borders" })}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.1] sm:text-5xl">
            {t({ pt: "Escuta profissional para quem precisou recomeçar.", en: "Professional care for those who had to start over." })}
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            {t({ pt: "Conectamos pessoas refugiadas a psicólogos voluntários verificados, de forma gratuita, segura e no idioma de cada um.", en: "We connect refugees with verified volunteer psychologists — free, safe, and in each person's language." })}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/psychologists" className="btn-primary px-6 py-3">{t({ pt: "Buscar apoio", en: "Find support" })}</Link>
            <Link to="/psychologist/onboarding" className="btn-outline px-6 py-3">{t({ pt: "Sou psicólogo(a) voluntário(a)", en: "I'm a volunteer psychologist" })}</Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            {t({ pt: "Projeto conceitual. Não há afiliação oficial com a UNESCO.", en: "Concept project. No official affiliation with UNESCO." })}
          </p>
        </div>
        <div className="relative">
          <img src={hero} alt={t({ pt: "Sessão de apoio por vídeo", en: "Video support session" })} width={1280} height={960} className="aspect-[4/3] w-full rounded-2xl object-cover" />
          <div className="card absolute -bottom-6 left-4 max-w-[16rem] p-4">
            <p className="font-display text-2xl font-semibold text-primary">8+</p>
            <p className="text-sm text-muted-foreground">{t({ pt: "idiomas atendidos na demonstração", en: "languages covered in the demo" })}</p>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-6 py-12 md:grid-cols-3">
        {pillars.map((p) => (
          <div key={p.n} className="border-t-2 border-primary pt-5">
            <p className="font-display text-sm text-accent">{p.n}</p>
            <h3 className="mt-2 text-xl font-semibold">{t(p.title)}</h3>
            <p className="mt-2 text-muted-foreground">{t(p.body)}</p>
          </div>
        ))}
      </section>

      <section className="container-page py-12">
        <div className="grid gap-8 rounded-2xl bg-ink p-8 text-ink-foreground md:grid-cols-2 md:p-12">
          <div>
            <h2 className="text-3xl font-semibold">{t({ pt: "Voluntariado que também forma", en: "Volunteering that also educates" })}</h2>
            <p className="mt-3 opacity-80">{t({ pt: "Psicólogos acumulam pontos por contribuição e podem se candidatar a oportunidades de bolsas (até 15%) oferecidas por instituições parceiras — sempre com critérios acadêmicos próprios.", en: "Psychologists earn contribution points and may apply for scholarship opportunities (up to 15%) from partner institutions — always under their own academic criteria." })}</p>
          </div>
          <div className="flex flex-wrap items-end gap-3 md:justify-end">
            <Link to="/ranking" className="btn-accent">{t({ pt: "Ver ranking", en: "See leaderboard" })}</Link>
            <Link to="/partnerships" className="btn border border-ink-foreground/30 text-ink-foreground hover:bg-ink-foreground/10">{t({ pt: "Parcerias", en: "Partnerships" })}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
