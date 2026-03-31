import type { Metadata } from "next";
import ReserveTableClient from "./reserve-table-client";

/* ─────────────────────────────────────────────
   Reserve a Table Page
   Desktop: 60/40 — form left, sticky summary right
   Form: Calendar → Time slots → Party size → Special requests
   ───────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Reserve a Table | Jennifer's Café",
  description: "Book your spot at Jennifer's Café. Select your date, time, and party size.",
};

export default function ReserveTablePage() {
  return <ReserveTableClient />;
}
