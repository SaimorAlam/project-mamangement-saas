import ViewerPanelOverview from "@/pages/viewerPanel/ViewerPanelOverview";
import ViewerPanelProjects from "@/pages/viewerPanel/ViewerPanelProjects";
import ViewerPanelMarketingStrategy from "@/pages/viewerPanel/ViewerPanelMarketingStrategy";
import ViewerPanelTimosSuperShop from "@/pages/viewerPanel/ViewerPanelTimosSuperShop";
import ViewerPanelProgramName from "@/pages/viewerPanel/ViewerPanelProgramName";
import ViewerPanelHighwayExpansion from "@/pages/viewerPanel/ViewerPanelHighwayExpansion";
import ViewerPanelHelp from "@/pages/viewerPanel/ViewerPanelHelp";
import ViewerPanelSupport from "@/pages/viewerPanel/ViewerPanelSupport";
import ViewerPanelSupportTickets from "@/pages/viewerPanel/ViewerPanelSupportTickets";
import ViewerPanelFeedback from "@/pages/viewerPanel/ViewerPanelFeedBack";
import ViewerPanelProductTour from "@/pages/viewerPanel/ViewerPanelProductTour";
import ViewerPanelSettings from "@/pages/viewerPanel/ViewerPanelSettings";
import ViewerPanelUserActivityLog from "@/pages/viewerPanel/ViewerPanelUsersActivityLog";
import ViewerPanelWorkInProgress from "@/pages/viewerPanel/ViewerPanelWorkInProgress";
import ViewerPanelActivityLog from "@/pages/viewerPanel/ViewerPanelActivityLog";
import ViewerPanelCreateTicket from "@/pages/viewerPanel/ViewerPanelCreateTicket";
import ViewerPanelContactUs from "@/pages/viewerPanel/ViewerPanelContactUs";
import ViewerPanelCarlyleHall from "@/pages/viewerPanel/ViewerPanelCarlyleHall";
import ViewerPanelEmployees from "@/pages/viewerPanel/ViewerPanelEmployees";
import ViewerPanelAlfalaBuilders from "@/pages/viewerPanel/ViewerPanelAlfalaBuilders";
import ViewerPanelAllProgram from "@/pages/viewerPanel/ViewerPanelAllProgram";

export default function getViewerPanelRoutes() {
  return [
    { index: true, element: <ViewerPanelOverview /> },
    { path: "projects", element: <ViewerPanelProjects /> },
    { path: "carlyle-hall", element: <ViewerPanelCarlyleHall /> },
    { path: "employees", element: <ViewerPanelEmployees /> },
    {
      path: "marketing-strategy",
      element: <ViewerPanelMarketingStrategy />,
    },
    {
      path: "alfala-building",
      element: <ViewerPanelAlfalaBuilders />,
    },
    {
      path: "timos-super-shop",
      element: <ViewerPanelTimosSuperShop />,
    },
    { path: "all-program", element: <ViewerPanelAllProgram /> },
    { path: "program-name", element: <ViewerPanelProgramName /> },
    {
      path: "highway-expansion",
      element: <ViewerPanelHighwayExpansion />,
    },
    { path: "activity-log", element: <ViewerPanelActivityLog /> },
    {
      path: "help",
      element: <ViewerPanelHelp />,
      children: [
        {
          path: "support",
          element: <ViewerPanelSupport />,
          children: [
            { index: true, element: <ViewerPanelSupportTickets /> },
            {
              path: "create-tickets",
              element: <ViewerPanelCreateTicket />,
            },
          ],
        },
        { path: "feedback", element: <ViewerPanelFeedback /> },
        { path: "product-tour", element: <ViewerPanelProductTour /> },
        { path: "contact-us", element: <ViewerPanelContactUs /> },
      ],
    },
    { path: "settings", element: <ViewerPanelSettings /> },
    {
      path: "work-in-progress",
      element: <ViewerPanelWorkInProgress />,
    },
    {
      path: "user-activity-log",
      element: <ViewerPanelUserActivityLog />,
    },
  ];
}
