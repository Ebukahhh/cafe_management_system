import type { Metadata } from "next";
import { getAdminCustomersData } from "@/lib/supabase/queries/admin-customers";
import CustomersAdminClient from "./customers-admin-client";

export const metadata: Metadata = {
  title: "Customers | Jennifer's Café Admin",
  description: "Manage your specialty coffee community, track loyalty progress, and handle subscription tiers.",
};

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const rows = await getAdminCustomersData();
  return <CustomersAdminClient initialRows={rows} />;
}
