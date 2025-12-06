import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getCurrentUserWithProfile } from "@/lib/profile";
import { signOutAction } from "./auth/actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Genie Sweepstakes",
  description: "Enter sweepstakes with Genie Coins.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userWithProfile = await getCurrentUserWithProfile();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-zinc-900`}>
        <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-lg font-semibold text-zinc-900">
                Genie Sweepstakes
              </Link>
              <nav className="flex items-center gap-4 text-sm text-zinc-700">
                <Link href="/sweepstakes" className="hover:text-indigo-600">
                  Sweepstakes
                </Link>
                <Link href="/admin/sweepstakes" className="hover:text-indigo-600">
                  Admin
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {userWithProfile ? (
                <>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-700">
                    {userWithProfile.user.email}
                  </span>
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="rounded-full border border-zinc-200 px-3 py-1 font-semibold text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50"
                    >
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="rounded-full bg-indigo-600 px-4 py-2 font-semibold text-white shadow hover:bg-indigo-700"
                >
                  Sign in / Sign up
                </Link>
              )}
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}

