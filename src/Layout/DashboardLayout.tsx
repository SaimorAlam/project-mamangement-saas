import SidebarNavigation from "@/Layout/AdminNav";
import AdminTopBar from "@/Layout/AdminTopBar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-4 font-bold text-xl">
          <img className="mt-6" src="Logo.png" alt="" />
        </div>
        <SidebarNavigation />
      </aside>
      <main className="flex-1 p-6">
        <AdminTopBar />
        <Outlet />
      </main>
    </div>
  );
}
