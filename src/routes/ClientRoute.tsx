// src/routes/clientRoutes.tsx
import Employee from "@/pages/client/NewEmployee/Employee";
import ProjectDetails from "@/pages/client/ProjectDetails/ProjectDetails";
import SupportDashboard from "@/pages/client/Support/SupportDashboard";
import { lazy } from "react";

const ClientOverview = lazy(
  () => import("@/pages/client/Overview/ClientOverview")
);
const ClientAllProgram = lazy(
  () => import("@/pages/client/Program/ClientAllProgram")
);
// const ClientEmployees = lazy(
//   () => import("@/pages/client/Employees/ClientEmployees")
// );
const ClientMarketingStrategy = lazy(
  () => import("@/pages/client/ClientMarketingStrategy")
);
// const ClientWorks = lazy(() => import("@/pages/client/ClientWorks"));
const ClientAlfalaBuilders = lazy(
  () => import("@/pages/client/ClientAlfalaBuilders")
);
const ClientTimosSuperShop = lazy(
  () => import("@/pages/client/ClientTimosSuperShop")
);
const ClientProgramBuilder = lazy(
  () => import("@/pages/client/ClientProgramBuilder")
);
const ClientProgramName = lazy(
  () => import("@/pages/client/ClientProgramName")
);
const ClientHighwayExpansion = lazy(
  () => import("@/pages/client/ClientHighwayExpansion")
);
const ClientAllHighway = lazy(() => import("@/pages/client/ClientAllHighway"));
const ClientCarlyleHall = lazy(
  () => import("@/pages/client/ClientCarlyleHall")
);
const ClientProjectReview = lazy(
  () => import("@/pages/client/ProjectReview/ClientProjectReview")
);
const ClientProjectBuilder = lazy(
  () => import("@/pages/client/ClientProjectBuilder")
);
const ClientSettings = lazy(
  () => import("@/pages/client/Settings/ClientSettings")
);
const ClientActivityLog = lazy(
  () => import("@/pages/client/ClientActivityLog")
);
const ClientHelp = lazy(() => import("@/pages/client/ClientHelp"));
// const ClientSupport = lazy(() => import("@/pages/client/ClientSupport"));
const ClientSupportTickets = lazy(
  () => import("@/pages/client/ClientSupportTickets")
);
const ClientCreateTicket = lazy(
  () => import("@/pages/client/ClientCreateTicket")
);
const ClientFeedback = lazy(() => import("@/pages/client/ClientFeedBack"));
const ClientProductTour = lazy(
  () => import("@/pages/client/ClientProductTour")
);
const ClientContactUs = lazy(() => import("@/pages/client/ClientContactUs"));
const ClientWorkInProgress = lazy(
  () => import("@/pages/client/ClientWorkInProgress")
);
const ClientUserActivityLog = lazy(
  () => import("@/pages/client/ClientUsersActivityLog")
);
const ClientSingleProject = lazy(
  () => import("@/pages/client/ClientSingleProject")
);
const ClientSingleProjectCreate = lazy(
  () => import("@/pages/client/ClientSingleProjectCreate")
);
const ProgramOverview = lazy(
  () => import("@/pages/client/Program/ProgramOverview")
);
const ClientAllProgramContainer = lazy(
  () => import("@/pages/client/ClientAllProgramContainer")
);

export function getClientRoutes() {
  return [
    { index: true, element: <ClientOverview /> },
    // { path: "works", element: <ClientWorks /> },
    // { path: "employees", element: <ClientEmployees /> },
    { path: "employees", element: <Employee /> },
    {
      path: "marketing-strategy",
      element: <ClientMarketingStrategy />,
    },
    { path: "alfala-building", element: <ClientAlfalaBuilders /> },
    { path: "timos-super-shop", element: <ClientTimosSuperShop /> },
    {
      path: "all-program",
      element: <ClientAllProgramContainer />,
      children: [{ index: true, element: <ClientAllProgram /> }],
    },
    { path: "program-overview/:id", element: <ProgramOverview /> },
    { path: "program-builder", element: <ClientProgramBuilder /> },
    { path: "program-name", element: <ClientProgramName /> },
    { path: "project-details/:id", element: <ProjectDetails /> },
    {
      path: "highway-expansion",
      element: <ClientHighwayExpansion />,
      children: [
        { path: "all-highway", element: <ClientAllHighway /> },
        { path: "carlyle-hall", element: <ClientCarlyleHall /> },
      ],
    },
    { path: "project-review", element: <ClientProjectReview /> },
    {
      path: "single-project",
      element: <ClientSingleProject />,
    },
    {
      path: "single-project-create",
      element: <ClientSingleProjectCreate />,
    },
    { path: "project-builder", element: <ClientProjectBuilder /> },
    { path: "activity-log", element: <ClientActivityLog /> },
    {
      path: "help",
      element: <ClientHelp />,
      children: [
        {
          path: "support",
          element: <SupportDashboard />,
          children: [
            { index: true, element: <ClientSupportTickets /> },
            {
              path: "create-tickets",
              element: <ClientCreateTicket />,
            },
          ],
        },
        // {
        //   path: "support",
        //   element: <ClientSupport />,
        //   children: [
        //     { index: true, element: <ClientSupportTickets /> },
        //     {
        //       path: "create-tickets",
        //       element: <ClientCreateTicket />,
        //     },
        //   ],
        // },
        { path: "feedback", element: <ClientFeedback /> },
        { path: "product-tour", element: <ClientProductTour /> },
        { path: "contact-us", element: <ClientContactUs /> },
      ],
    },
    { path: "settings", element: <ClientSettings /> },
    { path: "work-in-progress", element: <ClientWorkInProgress /> },
    { path: "user-activity-log", element: <ClientUserActivityLog /> },
  ];
}
