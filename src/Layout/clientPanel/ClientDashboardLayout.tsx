import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import ClientDashboardHeader from "./ClientDashboardHeader";
import ClientSidebar from "./ClientSidebar";
import GlobalLoader from "@/common/GlobalLoader";

export default function ClientDashboardLayout() {
  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "296px",
          "--sidebar-width-icon": "90px",
        } as React.CSSProperties
      }
    >
      <ClientSidebar />

      <main className="flex-1 min-w-0 px-4 md:px-8">
        <div className="pb-6">
          <ClientDashboardHeader />
        </div>

        <Suspense fallback={<GlobalLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </SidebarProvider>
  );
}
