import AlfalaBuilders from "@/pages/client/AlfalaBuilders";
import MarketingStrategy from "@/pages/client/MarketingStrategy";
import TimosSuperShop from "@/pages/client/TimosSuperShop";
import Employees from "@/pages/client/Employees";
import Overview from "@/pages/client/Overview";
import AllProgram from "@/pages/client/AllProgram";
import ProgramName from "@/pages/client/ProgramName";
import ActivityLog from "@/components/client/Overview/ActivityLog";
import Help from "@/pages/client/Help";
import Settings from "@/pages/client/Settings";
import WorkInProgress from "@/pages/client/WorkInProgress";
import Support from "@/pages/client/Support";
import SupportTickets from "@/pages/client/SupportTickets";
import CreateTicket from "@/pages/client/CreateTicket";
import Feedback from "@/pages/client/FeedBack";
import ProductTour from "@/pages/client/ProductTour";
import ContactUs from "@/pages/client/ContactUs";
import HighwayExpansion from "@/pages/client/HighwayExpansion";
import Projects from "@/pages/staffManager/Projects";
import CarlyleHall from "@/pages/client/CarlyleHall";
import UserActivityLog from "@/pages/client/UsersActivityLog";

export default function getViewerPanelRoutes() {
  return [
    { index: true, element: <Overview /> },
    { path: "projects", element: <Projects /> },
    { path: "carlyle-hall", element: <CarlyleHall /> },
    { path: "employees", element: <Employees /> },
    { path: "marketing-strategy", element: <MarketingStrategy /> },
    { path: "alfala-building", element: <AlfalaBuilders /> },
    { path: "timos-super-shop", element: <TimosSuperShop /> },
    { path: "all-program", element: <AllProgram /> },
    { path: "program-name", element: <ProgramName /> },
    { path: "highway-expansion", element: <HighwayExpansion /> },
    { path: "activity-log", element: <ActivityLog /> },
    {
      path: "help",
      element: <Help />,
      children: [
        {
          path: "support",
          element: <Support />,
          children: [
            { index: true, element: <SupportTickets /> },
            { path: "create-tickets", element: <CreateTicket /> },
          ],
        },
        { path: "feedback", element: <Feedback /> },
        { path: "product-tour", element: <ProductTour /> },
        { path: "contact-us", element: <ContactUs /> },
      ],
    },
    { path: "settings", element: <Settings /> },
    { path: "work-in-progress", element: <WorkInProgress /> },
    { path: "user-activity-log", element: <UserActivityLog /> },
  ];
}
