import { Sidebar } from "@/components/shared/sidebar";
import { Topbar } from "@/components/shared/topbar";
import { DashboardGuard } from "@/components/shared/dashboard-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardGuard>
      <div className="flex h-screen overflow-hidden bg-[#080808]">
        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
        {/* Mobile bottom nav */}
        <div className="md:hidden">
          <Sidebar mobile />
        </div>
      </div>
    </DashboardGuard>
  );
}
