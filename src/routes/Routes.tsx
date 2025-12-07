import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Forgot from "@/pages/Forgot";
import Reset from "@/pages/ResetPassword";
import EmailCode from "@/pages/EmailCode";
import TwoStepVerification from "@/pages/TwoStepVerification";
import Form from "@/pages/Form";
import Services from "@/pages/Services";
import Employees from "@/pages/Employees";

// Layout imports
import AdminDashboardLayout from "@/Layout/admin/AdminDashboardLayout";
// import PlatformAnalyticsOverview from "@/pages/Admin/PlatformAnalyticsOverview";

// Route list imports
import { getAdminRoutes } from "./AdminRoutes";
import ClientDashboardLayout from "./../Layout/client/ClientDashboardLayout";
import { getClientRoutes } from "./ClientRoute";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/form",
        element: <Form />,
      },
      {
        path: "/Employees",
        element: <Employees />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/forgot",
        element: <Forgot />,
      },
      {
        path: "/reset",
        element: <Reset />,
      },
      {
        path: "/verification",
        element: <TwoStepVerification />,
      },
      {
        path: "/emailcode",
        element: <EmailCode />,
      },

      // Super Admin routes
      {
        path: "/admin",
        element: <AdminDashboardLayout />,
        children: getAdminRoutes(),
      },

      // Client Route
      {
        path: "/client",
        element: <ClientDashboardLayout />,
        children: getClientRoutes(),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
