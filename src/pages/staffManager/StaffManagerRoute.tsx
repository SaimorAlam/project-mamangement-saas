import AlfalaBuilders from "@/pages/client/ClientAlfalaBuilders";
import ClientMarketingStrategy from "@/pages/client/ClientMarketingStrategy";
import ClientTimosSuperShop from "@/pages/client/ClientTimosSuperShop";
import Employees from "@/pages/client/Employees/ClientEmployees";
import ClientOverview from "@/pages/client/ClientOverview";
import AllProgram from "@/pages/client/ClientAllProgram";
import ClientProgramName from "@/pages/client/ClientProgramName";
import ActivityLog from "@/components/client/Overview/ActivityLog";
import ClientHelp from "@/pages/client/ClientHelp";
import ClientSettings from "@/pages/client/ClientSettings";
import ClientWorkInProgress from "@/pages/client/ClientWorkInProgress";
import ClientUserActivityLog from "@/pages/client/ClientUsersActivityLog";
import ClientSupport from "@/pages/client/ClientSupport";
import ClientSupportTickets from "@/pages/client/ClientSupportTickets";
import CreateTicket from "@/pages/client/ClientCreateTicket";
import ClientFeedback from "@/pages/client/ClientFeedBack";
import ClientProductTour from "@/pages/client/ClientProductTour";
import ContactUs from "@/pages/client/ClientContactUs";
import ClientHighwayExpansion from "@/pages/client/ClientHighwayExpansion";
import CarlyleHall from "@/pages/client/ClientCarlyleHall";
import AllProjectReview from "@/components/client/ProjectReview/AllProjectReview";
import ClientProjectReview from "@/pages/client/ClientProjectReview";
import ClientProjectBuilder from "@/pages/client/ClientProjectBuilder";
import StaffManagerProjects from "@/pages/staffManager/StaffManagerProjects";

export function getStaffManagerRoutes() {
  return [
    { index: true, element: <ClientOverview /> },
    { path: "projects", element: <StaffManagerProjects /> },
    { path: "carlyle-hall", element: <CarlyleHall /> },
    { path: "employees", element: <Employees /> },
    {
      path: "marketing-strategy",
      element: <ClientMarketingStrategy />,
    },
    { path: "alfala-building", element: <AlfalaBuilders /> },
    { path: "timos-super-shop", element: <ClientTimosSuperShop /> },
    { path: "all-program", element: <AllProgram /> },
    { path: "program-name", element: <ClientProgramName /> },
    { path: "project-builder", element: <ClientProjectBuilder /> },
    {
      path: "highway-expansion",
      element: <ClientHighwayExpansion />,
    },
    {
      path: "project-review",
      element: <ClientProjectReview />,
      children: [
        { path: "all-projects", element: <AllProjectReview /> },
        { path: "carlyle-hall", element: <CarlyleHall /> },
      ],
    },
    { path: "activity-log", element: <ActivityLog /> },
    {
      path: "help",
      element: <ClientHelp />,
      children: [
        {
          path: "support",
          element: <ClientSupport />,
          children: [
            { index: true, element: <ClientSupportTickets /> },
            { path: "create-tickets", element: <CreateTicket /> },
          ],
        },
        { path: "feedback", element: <ClientFeedback /> },
        { path: "product-tour", element: <ClientProductTour /> },
        { path: "contact-us", element: <ContactUs /> },
      ],
    },
    { path: "settings", element: <ClientSettings /> },
    { path: "work-in-progress", element: <ClientWorkInProgress /> },
    { path: "user-activity-log", element: <ClientUserActivityLog /> },
  ];
}
