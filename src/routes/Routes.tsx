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
import ClientDashboardLayout from "@/Layout/clientPanel/ClientDashboardLayout";
import StaffManagerDashboardLayout from "@/Layout/staffManagerPanel/StaffManagerDashboardLayout";
import { getClientRoutes } from "./ClientRoute";
import { getStaffManagerRoutes } from "./StaffManagerRoute";
import ViewerPanelDashboardLayout from "./../Layout/ViewerPanel/ViewerPanelDashboardLayout";
import getViewerPanelRoutes from "./ViewerRoute";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "@/common/Unauthorized";
import StaffEmployeeDashboardLayout from "@/Layout/staffEmployeePanel/StaffEmployeeDashboardLayout";
import getStaffEmployeeRoutes from "./StaffEmployeeRoute";

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
      {
        path: "/client-panel",
        element: (
          <ProtectedRoute allowedRoles={["CLIENT"]}>
            <ClientDashboardLayout />
          </ProtectedRoute>
        ),
        children: getClientRoutes(),
      },
      {
        path: "/staff-manager-panel",
        element: (
          <ProtectedRoute allowedRoles={["MANAGER"]}>
            <StaffManagerDashboardLayout />
          </ProtectedRoute>
        ),
        children: getStaffManagerRoutes(),
      },
      {
        path: "/staff-employee-panel",
        element: (
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <StaffEmployeeDashboardLayout />
          </ProtectedRoute>
        ),
        children: getStaffEmployeeRoutes(),
      },
      {
        path: "/viewer-panel",
        element: (
          <ProtectedRoute allowedRoles={["VIEWER"]}>
            <ViewerPanelDashboardLayout />
          </ProtectedRoute>
        ),
        children: getViewerPanelRoutes(),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);

export default routes;
