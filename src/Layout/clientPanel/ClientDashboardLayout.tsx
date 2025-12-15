import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import ClientDashboardHeader from "./ClientDashboardHeader";
import ClientSidebar from "./ClientSidebar";
import GlobalLoader from "@/common/GlobalLoader";


export default function ClientDashboardLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "296px",
        } as React.CSSProperties
      }
    >
      <ClientSidebar />

      <main className="w-full px-8">
        <div className="pb-6">
          <ClientDashboardHeader name="Timo" />
        </div>

        <Suspense fallback={<GlobalLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </SidebarProvider>
  );
}
