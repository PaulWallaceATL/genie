import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-16">
      <section className="flex flex-col gap-4 rounded-xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Genie Sweepstakes
        </p>
        <h1 className="text-3xl font-bold text-zinc-900">
          Enter giveaways with Genie Coins.
        </h1>
        <p className="max-w-3xl text-lg text-zinc-600">
          Sign in with Supabase Auth, earn or purchase Genie Coins, and enter
          live sweepstakes. A free Alternate Method of Entry is always
          available.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/sweepstakes"
            className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-indigo-700"
          >
            View Active Sweepstakes
          </Link>
          <Link
            href="/admin/sweepstakes"
            className="rounded-full border border-indigo-200 px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50"
          >
            Admin: Manage Sweepstakes
          </Link>
          <Link
            href="/auth"
            className="rounded-full border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50"
          >
            Sign in / Sign up
          </Link>
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Enter with Coins",
            description:
              "Spend Genie Coins you earned or purchased to enter live drawings.",
          },
          {
            title: "Free Daily Entry",
            description:
              "Every sweepstake has a free Alternate Method of Entry once per day.",
          },
          {
            title: "Secure & Server-side",
            description:
              "Server actions validate entries and keep winner logic on the server.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-zinc-900">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-zinc-600">{item.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

