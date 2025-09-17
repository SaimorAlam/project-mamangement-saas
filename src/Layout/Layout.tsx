import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Layout: React.FC = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin");
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
