import Link from "next/link";
import { GenieScene } from "./components/GenieScene";
import { LogoMark } from "./components/LogoMark";

const highlights = [
  { title: "Earn or buy Genie Coins", detail: "Rewarded ads + Stripe purchases" },
  { title: "AMOE friendly", detail: "Free entry once per day, per sweepstake" },
  { title: "Server-trusted", detail: "Winner logic never leaves the backend" },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-14 px-6 py-16">
      <section className="hero-grid relative grid gap-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/5 p-10 md:grid-cols-2">
        <div className="absolute inset-0">
          <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-[#5dd8ff]/25 blur-[90px]" />
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#a78bfa]/20 blur-[120px]" />
          <div className="absolute bottom-0 right-20 h-24 w-72 rounded-full bg-[#f8d477]/20 blur-[120px]" />
          <div className="absolute inset-0 grid-dots" />
        </div>

        <div className="relative flex flex-col gap-6">
          <span className="badge w-fit">
            <LogoMark size={18} />
            Trust & Fair Play
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              Summon luck with Genie Coins.
            </h1>
            <p className="max-w-xl text-lg text-white/70">
              Verified sweepstakes with paid, earned, and free AMOE entries. Secure auth, server-only
              winner logic, and transparent odds—no smoke and mirrors.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/sweepstakes" className="btn-primary text-sm">
              View active sweepstakes
            </Link>
            <Link href="/auth" className="btn-ghost text-sm">
              Earn or buy Genie Coins
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

        <div className="relative">
          <GenieScene />
          <div className="absolute -right-6 -bottom-6 w-[220px] rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur floating">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Next draw
            </p>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Ends in</p>
                <p className="text-xl font-semibold text-white">03h : 12m</p>
              </div>
              <span className="pill bg-white/10 text-[11px]">Live</span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#5dd8ff] via-[#a78bfa] to-[#f8d477]" />
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

