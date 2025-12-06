Project: Genie Sweepstakes Platform

Goal: Build a legal sweepstakes web app where users get “Genie Coins” (virtual, no cash value) and use them to enter sweepstakes. Coins can be:

bought via Stripe

earned via rewarded ads

not required, because each sweepstake has a free “No Purchase Necessary” entry (AMOE).

Tech stack:

Next.js 15+ with App Router, TypeScript, src/ directory

Tailwind CSS for styling

Supabase for auth + Postgres (using SQL schema I’ve already created with: profiles, sweepstakes, entries, orders, ad_rewards)

Stripe for buying Genie Coin packages (no cash-out)

Rewarded ads (start as mocked endpoints, real integration later)

Core rules / business logic:

Use Supabase Auth for login/sign-up.

Each user has a row in public.profiles with auth_user_id, email, coin_balance, state, age_verified, etc.

Entries into sweepstakes are in public.entries with enum entry_type in ('paid', 'earned', 'free').

“Paid” = coins spent, “earned” = coins from ads, “free” = AMOE (1 free entry per sweepstake per day).

Genie Coins are virtual only, no cash value, cannot be withdrawn or transferred user-to-user.

Winner selection must happen server-side only, never in the browser.

There will be an admin-only area for:

Creating/editing sweepstakes

Triggering winner selection

Code style / architecture:

TypeScript, strict, avoid any.

Use React Server Components where appropriate.

Keep business logic in server actions or Route Handlers, not directly in client components.

Use a reusable Supabase server client helper.

Clear separation:

UI components in src/app/... and src/components/...

Data access + business logic in src/lib/ and server actions.

MVP feature list:

User auth (sign in / sign up)

On first login, ensure profiles row exists with coin_balance = 0.

/sweepstakes page: list active sweepstakes.

/sweepstakes/[id] page: show details and allow:

“Enter with 1 Genie Coin” (paid)

“Free Entry (1 per day)” (free AMOE)

Server logic to:

validate sweepstake is active

enforce coin balance for paid entries

enforce one free entry per day per sweepstake per user

Basic admin page for creating sweepstakes (restrict by a hard-coded admin email for now).

Important:

When you generate code that touches the DB, assume the following tables already exist: profiles, sweepstakes, entries, orders, ad_rewards based on the SQL I’ve run. Do not invent random columns. If extra columns are truly needed, show the ALTER TABLE statements.

Never expose Supabase service keys or Stripe secret keys to the client."