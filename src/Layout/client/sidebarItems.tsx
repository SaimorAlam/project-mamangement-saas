import {
  Backpack,
  BriefcaseBusiness,
  Building2,
  ChartPie,
  Clipboard,
  FileChartColumnIncreasing,
  FolderClosed,
  Grid2x2,
  Headphones,
  Info,
  LayoutGrid,
  Megaphone,
  Milestone,
  Phone,
  Store,
  Users,
  UserStar,
} from "lucide-react";
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { ISidebarItem } from "@/types";

import CreateTicket from "@/pages/client/CreateTicket";
import SupportTickets from "@/pages/client/SupportTickets";
import CarlyleHall from "@/pages/client/CarlyleHall";
import AlfalaBuilders from "@/pages/client/AlfalaBuilders";
import MarketingStrategy from "@/pages/client/MarketingStrategy";
import TimosSuperShop from "@/pages/client/TimosSuperShop";
import Employees from "@/pages/client/Employees";
import Overview from "@/pages/Admin/Overview";
import Works from "@/pages/client/Works";
import AllProgram from "@/pages/client/AllProgram";
import ProgramBuilder from "@/pages/client/ProgramBuilder";
import ProgramName from "@/pages/client/ProgramName";
import AllHighway from "@/pages/client/AllHighway";
import Settings from "@/pages/client/Settings";
import HighwayExpansion from "@/pages/client/HighwayExpansion";
import ProjectReview from "@/pages/client/ProjectReview";
import ProjectBuilder from "@/pages/client/ProjectBuilder";
import ActivityLog from "@/pages/client/ActivityLog";
import Help from "@/pages/Admin/Help";
import Support from "@/pages/client/Support";

interface SidebarGroup {
  label: string;
  items: ISidebarItem[];
}

export const getSidebarItems = (): SidebarGroup[] => {
  const showHighwayExpansion =
    localStorage.getItem("showHighwayExpansion") === "true";

  return [
    {
      label: "Main Menu",
      items: [
        {
          icon: <ChartPie />,
          name: "Overview",
          path: "/client-panel",
          element: <Overview />,
        },
        {
          icon: <Backpack />,
          name: "Works",
          path: "/client-panel/works",
          element: <Works />,
        },
        {
          icon: <Users />,
          name: "Employees",
          path: "/client-panel/employees",
          element: <Employees />,
        },
      ],
    },
    {
      label: "Favorites",
      items: [
        {
          icon: <Megaphone />,
          name: "Marketing Strategy",
          path: "/client-panel/marketing-strategy",
          element: <MarketingStrategy />,
        },
        {
          icon: <Building2 />,
          name: "Alfala Building",
          path: "/client-panel/alfala-building",
          element: <AlfalaBuilders />,
        },
        {
          icon: <Store />,
          name: "Timo's Super Shop",
          path: "/client-panel/timos-super-shop",
          element: <TimosSuperShop />,
        },
      ],
    },
    {
      label: "Programs & Projects",
      items: [
        {
          icon: <LayoutGrid />,
          name: "All Program",
          path: "/client-panel/all-program",
          element: <AllProgram />,
        },
        {
          icon: <IoExtensionPuzzleOutline className="size-6" />,
          name: "Program Builder",
          path: "/client-panel/program-builder",
          element: <ProgramBuilder />,
        },
        {
          icon: <BriefcaseBusiness />,
          name: "Program Name",
          path: "/client-panel/program-name",
          element: <ProgramName />,
          hidden: showHighwayExpansion,
        },
        {
          icon: <BriefcaseBusiness />,
          name: (
            <span className="text-[15px]">Highway Expansion</span>
          ),
          className: "text-sm",
          path: "/client-panel/highway-expansion",
          element: <HighwayExpansion />,
          hidden: !showHighwayExpansion,
          children: [
            {
              icon: <FileChartColumnIncreasing />,
              name: "Highway Expansion",
              path: "all-highway",
              element: <AllHighway />,
            },
            {
              icon: <FolderClosed />,
              name: "Carlyle Hall",
              path: "carlyle-hall",
              element: <CarlyleHall />,
            },
          ],
        },
        {
          icon: <FileChartColumnIncreasing />,
          name: "Project Review",
          path: "/client-panel/project-review",
          element: <ProjectReview />,
        },
        {
          icon: <Grid2x2 />,
          name: "Project Builder",
          path: "/client-panel/project-builder",
          element: <ProjectBuilder />,
        },
      ].filter((item) => !item.hidden), // here add this code .filter((item) => !item.hidden),
    },
    {
      label: "Support",
      items: [
        {
          icon: <Clipboard />,
          name: "Activity Log",
          path: "/client-panel/activity-log",
          element: <ActivityLog />,
        },
        {
          icon: <Info />,
          name: "Help",
          path: "/help",
          element: <Help />,
          children: [
            {
              icon: <Headphones />,
              path: "support",
              name: "Support",
              element: <Support />,
              children: [
                { index: true, element: <SupportTickets /> },
                { path: "create-tickets", element: <CreateTicket /> },
              ],
            },
            /* {
              icon: <UserStar />,
              path: "feedback",
              name: "Feedback",
              element: <Feedback />,
            },
            {
              icon: <Milestone />,
              path: "product-tour",
              name: "Product Tour",
              element: <ProductTour />,
            },
            {
              icon: <Phone />,
              path: "contact-us",
              name: "Contact US",
              element: <ContactUs />,
            }, */
          ],
        },
        {
          icon: <IoSettingsOutline className="size-6" />,
          name: "Settings",
          path: "/client-panel/settings",
          element: <Settings />,
        },
      ],
    },
  ];
};
