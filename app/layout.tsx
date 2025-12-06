import type { Metadata } from "next";
import Link from "next/link";
import { Geist_Mono, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { getCurrentUserWithProfile } from "@/lib/profile";
import { signOutAction } from "./auth/actions";
import { LogoMark } from "./components/LogoMark";
import { PageLoader } from "./components/PageLoader";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Genie Sweepstakes";
const description =
  "Summon luck with Genie Coins. Enter verified sweepstakes with paid, earned, or free AMOE entries.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://genie-sweepstakes.example"),
  openGraph: {
    title,
    description,
    url: "https://genie-sweepstakes.example",
    siteName: "Genie Sweepstakes",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Genie Sweepstakes hero artwork",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userWithProfile = await getCurrentUserWithProfile();

  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} ${grotesk.variable} ${geistMono.variable} antialiased relative`}
      >
        <PageLoader />
        <header className="nav-glass sticky top-0 z-40">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                <LogoMark size={28} />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-semibold text-white">{title}</span>
                <span className="text-xs text-white/60">Luck, verified.</span>
              </div>
            </Link>
            <nav className="flex items-center gap-3 text-sm text-white/80">
              <Link href="/sweepstakes" className="pill hover:border-white/30 hover:bg-white/10">
                Sweepstakes
              </Link>
              <Link href="/account" className="pill hover:border-white/30 hover:bg-white/10">
                My account
              </Link>
              <Link href="/admin/sweepstakes" className="pill hover:border-white/30 hover:bg-white/10">
                Admin
              </Link>
              {userWithProfile ? (
                <div className="flex items-center gap-3">
                  <span className="pill bg-white/5 text-white/80">{userWithProfile.user.email}</span>
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="btn-ghost px-4 py-2 text-sm"
                    >
                      Sign out
                    </button>
                  </form>
                </div>
              ) : (
                <Link href="/auth" className="btn-primary text-sm px-4 py-2">
                  Sign in / Sign up
                </Link>
              )}
            </nav>
          </div>
        </header>
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -left-24 top-[-10%] h-64 w-64 rounded-full bg-[#2f6fde]/26 blur-[120px]" />
            <div className="absolute -right-10 top-10 h-56 w-56 rounded-full bg-[#f7c552]/20 blur-[120px]" />
            <div className="absolute bottom-0 left-1/2 h-52 w-72 -translate-x-1/2 rounded-full bg-[#0b1a34]/55 blur-[150px]" />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}

