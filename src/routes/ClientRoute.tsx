import Overview from "@/pages/client/Overview";
import AllProgram from "@/pages/client/AllProgram";
import Employees from "@/pages/client/Employees";
import MarketingStrategy from "@/pages/client/MarketingStrategy";
import Works from "@/pages/client/Works";
import AlfalaBuilders from "@/pages/client/AlfalaBuilders";
import TimosSuperShop from "@/pages/client/TimosSuperShop";
import ProgramBuilder from "@/pages/client/ProgramBuilder";
import ProgramName from "@/pages/client/ProgramName";
import HighwayExpansion from "@/pages/client/HighwayExpansion";
import AllHighway from "@/pages/client/AllHighway";
import CarlyleHall from "@/pages/client/CarlyleHall";

export function getClientRoutes() {
  return [
    { index: true, element: <Overview /> },
    { path: "works", element: <Works /> },
    { path: "employees", element: <Employees /> },
    { path: "marketing-strategy", element: <MarketingStrategy /> },
    { path: "alfala-building", element: <AlfalaBuilders /> },
    { path: "timos-super-shop", element: <TimosSuperShop /> },
    { path: "all-program", element: <AllProgram /> },
    { path: "program-builder", element: <ProgramBuilder /> },
    { path: "program-name", element: <ProgramName /> },
    {
      path: "highway-expansion",
      element: <HighwayExpansion />,
      children: [
        { path: "all-highway", element: <AllHighway /> },
        { path: "carlyle-hall", element: <CarlyleHall /> },
      ],
    },
    // { path: "project-review", element: <ProjectReview /> },
    // { path: "project-builder", element: <ProjectBuilder /> },
    // { path: "activity-log", element: <ActivityLog /> },
    // {
    //   path: "help",
    //   element: <Help />,
    //   children: [
    //     {
    //       path: "support",
    //       element: <Support />,
    //       children: [
    //         { index: true, element: <SupportTickets /> },
    //         { path: "create-ticket", element: <CreateTicket /> },
    //       ],
    //     },
    //     { path: "feedback", element: <Feedback /> },
    //     { path: "product-tour", element: <ProductTour /> },
    //     { path: "contact-us", element: <ContactUs /> },
    //   ],
    // },
    // { path: "settings", element: <Settings /> },
    // { path: "work-in-progress", element: <WorkInProgress /> },
    // { path: "user-activity-log", element: <UserActivityLog /> },
  ];
}
