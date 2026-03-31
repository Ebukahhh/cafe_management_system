import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getUserReservationsServer } from "@/lib/supabase/queries/reservations-server";
import MyReservationsClient from "./my-reservations-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Reservations | Jennifer's Café",
  description: "Manage your upcoming visits and view your reservation history.",
};

type PageProps = {
  searchParams: Promise<{ reserved?: string }>;
};

export default async function MyReservationsPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const reservations = user ? await getUserReservationsServer(user.id) : [];
  const params = await searchParams;
  const reservedJustSubmitted = params.reserved === "1";

  return (
    <MyReservationsClient
      reservations={reservations}
      isAuthenticated={!!user}
      reservedJustSubmitted={reservedJustSubmitted}
    />
  );
}
