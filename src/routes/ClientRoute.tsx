import ClientOverview from "@/pages/client/ClientOverview";
import ClientAllProgram from "@/pages/client/ClientAllProgram";
import ClientEmployees from "@/pages/client/ClientEmployees";
import ClientMarketingStrategy from "@/pages/client/ClientMarketingStrategy";
import ClientWorks from "@/pages/client/ClientWorks";
import ClientAlfalaBuilders from "@/pages/client/ClientAlfalaBuilders";
import ClientTimosSuperShop from "@/pages/client/ClientTimosSuperShop";
import ClientProgramBuilder from "@/pages/client/ClientProgramBuilder";
import ClientProgramName from "@/pages/client/ClientProgramName";
import ClientHighwayExpansion from "@/pages/client/ClientHighwayExpansion";
import ClientAllHighway from "@/pages/client/ClientAllHighway";
import ClientCarlyleHall from "@/pages/client/ClientCarlyleHall";
import ClientProjectReview from "@/pages/client/ClientProjectReview";
import ClientProjectBuilder from "@/pages/client/ClientProjectBuilder";
import ClientSettings from "@/pages/client/ClientSettings";
import ClientActivityLog from "@/pages/client/ClientActivityLog";
import ClientHelp from "@/pages/client/ClientHelp";
import ClientSupport from "@/pages/client/ClientSupport";
import ClientSupportTickets from "@/pages/client/ClientSupportTickets";
import ClientCreateTicket from "@/pages/client/ClientCreateTicket";
import ClientFeedback from "@/pages/client/ClientFeedBack";
import ClientProductTour from "@/pages/client/ClientProductTour";
import ClientContactUs from "@/pages/client/ClientContactUs";
import ClientWorkInProgress from "@/pages/client/ClientWorkInProgress";
import ClientUserActivityLog from "@/pages/client/ClientUsersActivityLog";
import ClientSingleProject from "./../pages/client/ClientSingleProject";

export function getClientRoutes() {
  return [
    { index: true, element: <ClientOverview /> },
    { path: "works", element: <ClientWorks /> },
    { path: "employees", element: <ClientEmployees /> },
    {
      path: "marketing-strategy",
      element: <ClientMarketingStrategy />,
    },
    { path: "alfala-building", element: <ClientAlfalaBuilders /> },
    { path: "timos-super-shop", element: <ClientTimosSuperShop /> },
    { path: "all-program", element: <ClientAllProgram /> },
    { path: "program-builder", element: <ClientProgramBuilder /> },
    { path: "program-name", element: <ClientProgramName /> },
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
    { path: "project-builder", element: <ClientProjectBuilder /> },
    { path: "activity-log", element: <ClientActivityLog /> },
    {
      path: "help",
      element: <ClientHelp />,
      children: [
        {
          path: "support",
          element: <ClientSupport />,
          children: [
            { index: true, element: <ClientSupportTickets /> },
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
