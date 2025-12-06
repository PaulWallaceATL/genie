import Link from "next/link";
import { LogoMark } from "./components/LogoMark";

const highlights = [
  { title: "Earn or buy Genie Coins", detail: "Rewarded ads + Stripe purchases" },
  { title: "AMOE friendly", detail: "Free entry once per day, per sweepstake" },
  { title: "Server-trusted", detail: "Winner logic never leaves the backend" },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-14 px-6 py-16">
      <section className="hero-grid relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/5 p-10">
        <div className="absolute inset-0">
          <div className="absolute left-6 top-6 h-32 w-32 rounded-full bg-[#f7c552]/24 blur-[90px]" />
          <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[#2f6fde]/24 blur-[130px]" />
          <div className="absolute bottom-[-10%] left-20 h-32 w-96 rounded-full bg-[#0b1a34]/60 blur-[110px]" />
          <div className="absolute inset-0 grid-dots" />
        </div>

        <div className="relative grid gap-8 md:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="flex flex-col gap-6">
            <span className="badge w-fit">
              <LogoMark size={18} />
              Cairo Nights
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
                Gold lamps, blue genies, real sweepstakes.
              </h1>
              <p className="max-w-xl text-lg text-white/70">
                Earn or buy Genie Coins, enter verified drawings, and claim your daily AMOE entry. The
                magic stays server-side, so odds stay fair.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/sweepstakes" className="btn-primary text-sm">
                View active sweepstakes
              </Link>
              <Link href="/auth" className="btn-ghost text-sm">
                Sign in / earn coins
              </Link>
              <Link href="/admin/sweepstakes" className="pill text-sm">
                Admin tools
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.title} className="card p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm text-white/80">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative w-full max-w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0b1a34] via-[#0a1122] to-[#050911] p-6 shadow-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(247,197,82,0.22),transparent_40%),radial-gradient(circle_at_70%_20%,rgba(47,111,222,0.3),transparent_35%)] opacity-80" />
              <div className="relative flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="pill text-[11px]">Next draw</span>
                  <span className="text-[11px] text-white/60">Tonight</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white/10 ring-1 ring-white/10 flex items-center justify-center">
                    <LogoMark size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Prize pot</p>
                    <p className="text-xl font-semibold text-white">$5,000</p>
                  </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#2f6fde] via-[#4fa3ff] to-[#f7c552]" />
                </div>
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Entries closing soon</span>
                  <span className="text-white">03h : 12m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "3 entry modes",
            description: "Paid with coins, earned via rewarded ads, or 1 free AMOE entry daily.",
          },
          {
            title: "Guarded fairness",
            description: "Server actions validate state; winner selection never runs client-side.",
          },
          {
            title: "Ready to scale",
            description: "Supabase Auth + Postgres with clear profiles, entries, orders, and rewards.",
          },
        ].map((item) => (
          <article key={item.title} className="card p-5">
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-white/70">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-2">
          <p className="badge">Flow</p>
          <h2 className="text-2xl font-semibold text-white">How it works</h2>
          <p className="text-white/70">Three quick steps to your first entry.</p>
        </div>
        <div className="md:col-span-2 grid gap-4">
          {[
            {
              title: "Sign in & verify",
              detail:
                "Create your Supabase account, auto-provisioned with a profile and a zero coin balance.",
            },
            {
              title: "Fund your luck",
              detail:
                "Earn Genie Coins from rewarded ads or purchase with Stripe. Balance updates server-side.",
            },
            {
              title: "Enter securely",
              detail:
                "Paid, earned, or free AMOE—server actions check balance, enforce limits, and log entries.",
            },
          ].map((step, idx) => (
            <div key={step.title} className="card flex items-start gap-4 p-5">
              <span className="pill text-sm">0{idx + 1}</span>
              <div>
                <p className="text-base font-semibold text-white">{step.title}</p>
                <p className="text-sm text-white/70">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

