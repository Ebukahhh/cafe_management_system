import type { Metadata } from "next";
import { AppProviders } from "./providers";
import "./globals.css";
import CartSidebar from "@/components/CartSidebar";

export const metadata: Metadata = {
  title: "Jennifer's Cafe Management System | Specialty Coffee",
  description:
    "Order ahead, book a table, and set up your daily coffee subscription - all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-dvh flex flex-col bg-deep-espresso text-on-surface font-body antialiased"
        suppressHydrationWarning
      >
        <AppProviders>
          {children}
          <CartSidebar />
        </AppProviders>
      </body>
    </html>
  );
}
