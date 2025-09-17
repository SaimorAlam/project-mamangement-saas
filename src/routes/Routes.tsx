import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import AdminRoute from "./AdminRoutes";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Form from "@/pages/Form";
import Services from "@/pages/Services";
import Help from "@/pages/Admin/Help";
import Clients from "@/pages/Admin/Clients";
import Analytics from "@/pages/Admin/Analytics";
import SystemHealth from "@/pages/Admin/SystemHealth";
import BillingsPlans from "@/pages/Admin/BillingsPlans";
import APIIntegrations from "@/pages/Admin/APIIntegrations";
import SecurityPrivacy from "@/pages/Admin/SecurityPrivacy";
import GlobalSettings from "@/pages/Admin/GlobalSettings";

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
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/admin",
        element: <AdminRoute />, // This will check if the user is an admin
        children: [
          { 
            index: true,
            path: "", 
            element: <AdminDashboard /> 
          },
          {
            path: "clients", 
            element: <Clients />
          },
          {
            path: "analytics", 
            element: <Analytics />
          },
          {
            path: "systemHealth", 
            element: <SystemHealth />
          },
          {
            path: "billings", 
            element: <BillingsPlans />
          },
          {
            path: "apiIntegration", 
            element: <APIIntegrations />
          },
          {
            path: "security", 
            element: <SecurityPrivacy />
          },
          {
            path: "help", 
            element: <Help />
          },
          {
            path: "globalSettings", 
            element: <GlobalSettings />
          }
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
