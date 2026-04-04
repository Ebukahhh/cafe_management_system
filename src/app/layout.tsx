import type { Metadata } from "next";
import { Fraunces, DM_Sans, Inter } from "next/font/google";
import { AppProviders } from "./providers";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jennifer's Café Management System | Specialty Coffee",
  description:
    "Order ahead, book a table, and set up your daily coffee subscription — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-dvh flex flex-col bg-deep-espresso text-on-surface font-body antialiased"
        suppressHydrationWarning
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
