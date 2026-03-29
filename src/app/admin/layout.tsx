import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminSidebar />
      <div className="lg:ml-[240px] min-h-screen bg-deep-espresso">
        {children}
      </div>
    </>
  );
}
