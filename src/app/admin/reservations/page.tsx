import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminReservationsAll } from "@/lib/supabase/queries/admin-reservations";
import { todayYmdInTimezone, toLocalYmd } from "@/lib/format-datetime";
import { ReservationManagerClient } from "./reservation-manager-client";

export const metadata: Metadata = {
  title: "Reservations | Jennifer's Café Admin",
  description: "Manage daily reservations, confirm or decline guest requests.",
};

type PageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function ReservationManagerPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/reservations");

  const params = await searchParams;
  const defaultDay =
    process.env.CAFE_TIMEZONE && process.env.CAFE_TIMEZONE.length > 0
      ? todayYmdInTimezone(process.env.CAFE_TIMEZONE)
      : toLocalYmd(new Date());
  const dateYmd =
    typeof params.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(params.date)
      ? params.date
      : defaultDay;

  const rows = await getAdminReservationsAll();

  return <ReservationManagerClient dateYmd={dateYmd} initialRows={rows} />;
}
