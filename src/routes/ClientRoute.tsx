// src/routes/clientRoutes.tsx

import Employee from "@/pages/client/NewEmployee/Employee";
import ProjectDetails from "@/pages/client/ProjectDetails/ProjectDetails";
import SupportDashboard from "@/pages/client/Support/SupportDashboard";

import ClientOverview from "@/pages/client/Overview/ClientOverview";
import ClientAllProgram from "@/pages/client/Program/ClientAllProgram";
import ClientMarketingStrategy from "@/pages/client/ClientMarketingStrategy";
import ClientAlfalaBuilders from "@/pages/client/ClientAlfalaBuilders";
import ClientTimosSuperShop from "@/pages/client/ClientTimosSuperShop";
import ClientProgramBuilder from "@/pages/client/ClientProgramBuilder";
import ClientProgramName from "@/pages/client/ClientProgramName";
import ClientHighwayExpansion from "@/pages/client/ClientHighwayExpansion";
import ClientAllHighway from "@/pages/client/ClientAllHighway";
import ClientCarlyleHall from "@/pages/client/ClientCarlyleHall";
import ClientProjectReview from "@/pages/client/ProjectReview/ClientProjectReview";
import ClientProjectBuilder from "@/pages/client/ProjectBuilder/ClientProjectBuilder";
import ClientSettings from "@/pages/client/Settings/ClientSettings";
import ClientActivityLog from "@/pages/client/ClientActivityLog";
import ClientHelp from "@/pages/client/ClientHelp";
import ClientCreateTicket from "@/pages/client/Support/ClientCreateTicket";
import ClientFeedback from "@/pages/client/ClientFeedBack";
import ClientProductTour from "@/pages/client/ClientProductTour";
import ClientContactUs from "@/pages/client/ClientContactUs";
import ClientWorkInProgress from "@/pages/client/ClientWorkInProgress";
import ClientUserActivityLog from "@/pages/client/ClientUsersActivityLog";
import ClientSingleProject from "@/pages/client/ClientSingleProject";
import ClientSingleProjectCreate from "@/pages/client/ClientSingleProjectCreate";
import ProgramOverview from "@/pages/client/Program/ProgramOverview";
import ClientAllProgramContainer from "@/pages/client/ClientAllProgramContainer";

export function getClientRoutes() {
  return [
    { index: true, element: <ClientOverview /> },

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
      children: [
        { index: true, element: <ClientAllProgram /> },
        { path: "program-overview/:id", element: <ProgramOverview /> },
      ],
    },
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

    { path: "single-project", element: <ClientSingleProject /> },
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
            {
              path: "create-tickets",
              element: <ClientCreateTicket />,
            },
          ],
        },
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
