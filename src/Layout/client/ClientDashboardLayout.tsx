import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import AppSidebar from "./AppSidebar";

export default function ClientDashboardLayout() {
  return (
    <div className="">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "296px",
          } as React.CSSProperties
        }
        className=""
      >
        <AppSidebar />
        <main className="w-full px-8">
          <div className="pb-6">
            <Header name="Timo" />
          </div>
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}
