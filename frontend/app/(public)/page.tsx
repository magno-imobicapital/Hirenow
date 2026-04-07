import Link from "next/link";

export default function LandingPage() {
  return (
    <main
      className="bg-secondary-dark text-white overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', -apple-system, sans-serif" }}
    >
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@400;500;600&family=Instrument+Serif:ital@1&display=swap"
      />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.06); }
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .display { font-family: 'Outfit', sans-serif; }
        .serif { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; }
        .marquee-track { animation: marquee 30s linear infinite; }
        .glow { animation: glow 8s ease-in-out infinite; }
        .rise { animation: rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* ── Top nav ── */}
      <header className="relative z-50 border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/logo_white_blue.png"
              alt="Hireme"
              className="h-6 w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/positions" className="text-sm text-white/70 hover:text-white transition-colors">Vagas</Link>
            <a href="#features" className="text-sm text-white/70 hover:text-white transition-colors">Plataforma</a>
            <a href="#how" className="text-sm text-white/70 hover:text-white transition-colors">Como funciona</a>
            <a href="#stats" className="text-sm text-white/70 hover:text-white transition-colors">Resultados</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:inline text-sm font-medium text-white/80 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-full bg-white text-secondary-dark px-5 py-2.5 text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-300"
            >
              Começar agora
              <span className="inline-block">→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-white/10">
        {/* Ambient glow */}
        <div
          className="glow absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(2,150,216,0.45) 0%, rgba(2,150,216,0.15) 35%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <div
          className="glow absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(57,176,232,0.35) 0%, transparent 70%)",
            filter: "blur(40px)",
            animationDelay: "3s",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Grain */}
        <div className="grain absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" />

        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 pt-24 pb-32">
          {/* Eyebrow */}
          <div className="rise flex items-center gap-3 mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-sm px-4 py-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Plataforma de recrutamento 2026
            </span>
          </div>

          {/* Headline */}
          <h1
            className="display rise text-[clamp(3rem,10vw,9rem)] font-black leading-[0.88] tracking-[-0.04em] max-w-[1200px]"
            style={{ animationDelay: "0.1s" }}
          >
            Recrutamento <br />
            <span className="text-primary">sem ruído</span>.{" "}
            <span className="serif text-white/90 font-normal" style={{ fontSize: "0.85em" }}>
              Resultado
            </span>
            <br />
            sem desculpa.
          </h1>

          {/* Sub */}
          <div className="rise mt-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10" style={{ animationDelay: "0.25s" }}>
            <p className="max-w-xl text-lg sm:text-xl text-white/65 leading-relaxed">
              Vagas que se acham. Candidaturas que andam.
              Candidatos e recrutadores no mesmo ritmo —
              <span className="text-white"> sem planilha, sem CC em cinco e-mails</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary text-white px-8 py-4 text-base font-semibold shadow-[0_20px_60px_-20px_rgba(2,150,216,0.7)] hover:bg-primary-light transition-all duration-300"
              >
                Criar conta grátis
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/positions"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.03] backdrop-blur-sm px-8 py-4 text-base font-semibold text-white hover:bg-white/[0.08] hover:border-white/40 transition-all duration-300"
              >
                Ver vagas abertas
              </Link>
            </div>
          </div>

          {/* Floating preview row */}
          <div className="rise mt-24 grid grid-cols-1 md:grid-cols-3 gap-4" style={{ animationDelay: "0.4s" }}>
            {[
              {
                label: "candidatura",
                title: "Tech Lead Mobile",
                badge: "EM ANDAMENTO",
                badgeClass: "bg-amber-400/15 text-amber-300 border-amber-400/30",
                meta: "atualizado há 2min",
              },
              {
                label: "entrevista",
                title: "Desafio Técnico",
                badge: "AGENDADA",
                badgeClass: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
                meta: "amanhã, 14:30",
              },
              {
                label: "vaga",
                title: "Engenheiro Backend Sr.",
                badge: "12 CANDIDATOS",
                badgeClass: "bg-primary/15 text-primary-light border-primary/30",
                meta: "publicada há 3 dias",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-5 hover:border-primary/40 hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-1"
                style={{ transform: `rotate(${i === 1 ? "0deg" : i === 0 ? "-1.2deg" : "1.2deg"})` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/40">{card.label}</span>
                  <span className={`text-[10px] font-semibold tracking-wider uppercase border rounded-full px-2 py-0.5 ${card.badgeClass}`}>
                    {card.badge}
                  </span>
                </div>
                <p className="display text-2xl font-bold tracking-tight mb-2">{card.title}</p>
                <p className="text-xs text-white/40">{card.meta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <section className="relative border-b border-white/10 py-8 overflow-hidden bg-primary">
        <div className="marquee-track flex gap-12 whitespace-nowrap will-change-transform">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex items-center gap-12 shrink-0">
              {[
                "RECRUTAMENTO SEM RUÍDO",
                "★",
                "VAGAS QUE SE ACHAM",
                "★",
                "CANDIDATURA EM 30 SEGUNDOS",
                "★",
                "ZERO PLANILHA",
                "★",
                "E-MAILS QUE NÃO PARECEM ROBÔ",
                "★",
                "ATUALIZAÇÕES EM TEMPO REAL",
                "★",
              ].map((t, i) => (
                <span
                  key={i}
                  className={`display text-[clamp(1.5rem,4vw,3rem)] font-black tracking-tight ${
                    t === "★" ? "text-white/40" : "text-white"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" className="relative border-b border-white/10 py-32">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
          <div className="flex items-end justify-between mb-20 flex-wrap gap-6">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-3">/ números</p>
              <h2 className="display text-5xl sm:text-7xl font-black tracking-[-0.03em] leading-[0.9] max-w-2xl">
                Não é hype.<br />
                <span className="serif font-normal text-white/80">É métrica</span>.
              </h2>
            </div>
            <p className="text-white/50 text-sm max-w-xs leading-relaxed">
              Resultado real do que acontece quando o processo funciona como deveria.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
            {[
              { num: "12x", label: "mais rápido pra fechar uma vaga" },
              { num: "0", label: "planilhas necessárias" },
              { num: "98%", label: "dos candidatos respondem o email" },
              { num: "30s", label: "do clique até a candidatura" },
            ].map((s, i) => (
              <div key={i} className="bg-secondary-dark p-10 hover:bg-white/[0.02] transition-colors group">
                <p className="display text-7xl sm:text-8xl font-black text-primary tracking-[-0.04em] leading-none mb-4 group-hover:scale-105 transition-transform origin-left duration-500">
                  {s.num}
                </p>
                <p className="text-sm text-white/50 leading-relaxed max-w-[200px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative border-b border-white/10 py-32">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
          <div className="mb-20 max-w-3xl">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-3">/ plataforma</p>
            <h2 className="display text-5xl sm:text-7xl font-black tracking-[-0.03em] leading-[0.9]">
              Tudo num lugar.{" "}
              <span className="serif font-normal text-white/80">Nada</span>{" "}
              fora de hora.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Feature card 1 — large */}
            <div className="lg:col-span-7 lg:row-span-2 group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-10 hover:border-primary/40 transition-all duration-500">
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-700"
                style={{ background: "radial-gradient(circle, rgba(2,150,216,0.5), transparent 70%)" }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-8">
                  <span className="display text-xs font-bold tracking-[0.2em] uppercase text-primary">01</span>
                  <span className="text-xs font-semibold tracking-wider uppercase text-white/40">acompanhamento</span>
                </div>
                <h3 className="display text-4xl sm:text-5xl font-black tracking-[-0.02em] leading-[1] mb-6">
                  Status que muda<br />
                  <span className="text-primary">em tempo real</span>.
                </h3>
                <p className="text-white/60 text-base leading-relaxed max-w-md mb-10">
                  Cada candidatura tem um status visível. Cada mudança dispara um e-mail. Cada e-mail é redondo o suficiente pra parecer feito a mão.
                </p>
                <div className="grid grid-cols-3 gap-2 mt-12">
                  {[
                    { label: "PENDENTE", active: false },
                    { label: "EM ANÁLISE", active: true },
                    { label: "ENTREVISTA", active: false },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border p-4 text-center transition-all ${
                        s.active
                          ? "border-primary bg-primary/10 text-primary scale-105"
                          : "border-white/10 text-white/40"
                      }`}
                    >
                      <p className="text-[10px] font-bold tracking-wider">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature card 2 */}
            <div className="lg:col-span-5 group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-10 hover:border-primary/40 transition-all duration-500">
              <div className="flex items-center gap-2 mb-6">
                <span className="display text-xs font-bold tracking-[0.2em] uppercase text-primary">02</span>
                <span className="text-xs font-semibold tracking-wider uppercase text-white/40">descoberta</span>
              </div>
              <h3 className="display text-3xl sm:text-4xl font-black tracking-[-0.02em] leading-[1] mb-4">
                Vagas filtradas<br />pelo que importa.
              </h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-md">
                Busca rápida, filtros que fazem sentido, e zero scroll infinito sem objetivo.
              </p>
            </div>

            {/* Feature card 3 */}
            <div className="lg:col-span-5 group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-10 hover:border-primary/40 transition-all duration-500">
              <div className="flex items-center gap-2 mb-6">
                <span className="display text-xs font-bold tracking-[0.2em] uppercase text-primary">03</span>
                <span className="text-xs font-semibold tracking-wider uppercase text-white/40">entrevistas</span>
              </div>
              <h3 className="display text-3xl sm:text-4xl font-black tracking-[-0.02em] leading-[1] mb-4">
                Agenda que<br />não se perde.
              </h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-md">
                Marcou? O candidato sabe. O recrutador sabe. O link da call já vem no e-mail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="relative border-b border-white/10 py-32 bg-gradient-to-b from-secondary-dark via-[#1a242b] to-secondary-dark">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
          <div className="mb-20 max-w-3xl">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-3">/ como funciona</p>
            <h2 className="display text-5xl sm:text-7xl font-black tracking-[-0.03em] leading-[0.9]">
              Três passos. <span className="serif font-normal text-white/80">Zero</span> ladainha.
            </h2>
          </div>

          <div className="space-y-2">
            {[
              {
                num: "01",
                title: "Crie sua conta",
                desc: "30 segundos. Nem cartão. Nem sangue. Só e-mail e senha.",
                action: "/register",
                actionLabel: "Começar agora",
              },
              {
                num: "02",
                title: "Encontre a vaga certa",
                desc: "Busca, filtros e descrição honesta. Nada de \"buscamos um ninja com 8 anos em tecnologia que existe há 4\".",
                action: "/positions",
                actionLabel: "Ver vagas",
              },
              {
                num: "03",
                title: "Candidate-se e acompanhe",
                desc: "Um clique pra aplicar. Cada movimentação chega no seu e-mail antes de você lembrar que aplicou.",
                action: "/register",
                actionLabel: "Candidatar-se",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="group grid grid-cols-12 gap-4 items-center border-t border-white/10 py-12 hover:border-primary transition-colors duration-500"
              >
                <div className="col-span-2 lg:col-span-1">
                  <p className="display text-5xl lg:text-6xl font-black text-white/20 group-hover:text-primary transition-colors duration-500 tracking-tight">
                    {step.num}
                  </p>
                </div>
                <div className="col-span-10 lg:col-span-7">
                  <h3 className="display text-3xl lg:text-5xl font-black tracking-[-0.02em] mb-2 group-hover:translate-x-2 transition-transform duration-500">
                    {step.title}
                  </h3>
                  <p className="text-white/55 text-base lg:text-lg leading-relaxed max-w-2xl">{step.desc}</p>
                </div>
                <div className="col-span-12 lg:col-span-4 lg:text-right">
                  <Link
                    href={step.action}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-light transition-colors group/link"
                  >
                    {step.actionLabel}
                    <span className="inline-block transition-transform group-hover/link:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BIG CTA ── */}
      <section className="relative py-32 overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(2,150,216,0.25) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 text-center">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-primary mb-6">/ próxima parada</p>
          <h2 className="display text-[clamp(3rem,11vw,10rem)] font-black tracking-[-0.05em] leading-[0.85]">
            Para de ler. <br />
            <span className="serif font-normal text-white/80">Vai</span> testar.
          </h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto mt-10 leading-relaxed">
            Cria a conta, explora as vagas, sente como deveria ser desde sempre. Sem compromisso, sem dor.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-white px-10 py-5 text-base font-semibold shadow-[0_25px_70px_-20px_rgba(2,150,216,0.7)] hover:bg-primary-light transition-all duration-300 hover:scale-[1.02]"
            >
              Começar agora
              <span>→</span>
            </Link>
            <Link
              href="/positions"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.03] backdrop-blur-sm px-10 py-5 text-base font-semibold text-white hover:bg-white/[0.08] hover:border-white/40 transition-all duration-300"
            >
              Ver vagas primeiro
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative py-16">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
            <div>
              <img
                src="/images/logo_white_blue.png"
                alt="Hireme"
                className="h-7 w-auto mb-4"
              />
              <p className="display text-2xl font-bold tracking-tight max-w-sm leading-tight">
                Recrutamento sem ruído.<br />
                <span className="serif font-normal text-white/60">Resultado sem desculpa</span>.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <Link href="/positions" className="text-white/60 hover:text-white transition-colors">Vagas</Link>
              <Link href="/login" className="text-white/60 hover:text-white transition-colors">Entrar</Link>
              <Link href="/register" className="text-white/60 hover:text-white transition-colors">Criar conta</Link>
              <a href="#features" className="text-white/60 hover:text-white transition-colors">Plataforma</a>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs text-white/40 tracking-wide">© 2026 Hireme — Feito com pressa boa.</p>
            <p className="text-xs text-white/40 display tracking-[0.2em] uppercase font-semibold">
              v1.0 · build em produção
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
