import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Layout: React.FC = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin") || location.pathname.startsWith("/login") || location.pathname.startsWith("/signup") || location.pathname.startsWith("/forgot") || location.pathname.startsWith("/emailcode") || location.pathname.startsWith("/verification") || location.pathname.startsWith("/reset");
  return (
    <div>
      {!isDashboardRoute && <Navbar />}
      <main>
        <Outlet />
      </main>
      {!isDashboardRoute && <Footer />}
    </div>
  );
};

export default Layout;
