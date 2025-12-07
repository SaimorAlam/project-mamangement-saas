import CreateTicket from "@/pages/client/CreateTicket";
import SupportTickets from "@/pages/client/SupportTickets";
import CarlyleHall from "@/data/AllDataTab/CarlyleHall";
// import AlfalaBuilders from "@/pages/ClientPanel/Favorites/AlfalaBuilders";
// import MarketingStrategy from "@/pages/ClientPanel/Favorites/MarketingStrategy";
// import TimosSuperShop from "@/pages/ClientPanel/Favorites/TimosSuperShop";
import Employees from "@/pages/client/Employees";
import Overview from "@/pages/Admin/Overview";
// import Works from "@/pages/ClientPanel/MainMenu/Works";
import AllProgram from "@/pages/client/AllProgram";
/* import AllHighway from "@/pages/ClientPanel/Program&Projects/HighwayExpansion/AllHighway";
import HighwayExpansion from "@/pages/ClientPanel/Program&Projects/HighwayExpansion/HighwayExpansion";
import ProgramBuilder from "@/pages/ClientPanel/Program&Projects/ProgramBuilder";
import ProgramName from "@/pages/ClientPanel/Program&Projects/ProgramName";
import ProjectBuilder from "@/pages/ClientPanel/Program&Projects/ProjectBuilder";
import ProjectReview from "@/pages/ClientPanel/Program&Projects/ProjectReview";
import ActivityLog from "@/pages/ClientPanel/Support/ActivityLog";
import ContactUs from "@/pages/ClientPanel/Support/Help/ContactUs";
import Feedback from "@/pages/ClientPanel/Support/Help/Feedback";
import Help from "@/pages/ClientPanel/Support/Help/Help";
import ProductTour from "@/pages/ClientPanel/Support/Help/ProductTour";
import Support from "@/pages/ClientPanel/Support/Help/Support";
import Settings from "@/pages/ClientPanel/Support/Settings"; */

import {
  // Backpack,
  BriefcaseBusiness,
  // Building2,
  ChartPie,
  Clipboard,
  FileChartColumnIncreasing,
  FolderClosed,
  Grid2x2,
  Headphones,
  Info,
  LayoutGrid,
  // Megaphone,
  Milestone,
  Phone,
  // Store,
  Users,
  UserStar,
} from "lucide-react";
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";

interface SidebarItem {
  icon?: React.ReactElement;
  name?: string | React.ReactElement;
  path?: string;
  element?: React.ReactNode;
  hidden?: boolean;
  children?: SidebarItem[];
  index?: boolean;
}

interface SidebarGroup {
  label: string;
  items: SidebarItem[];
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
          path: "/client",
          element: <Overview />,
        },
        // { icon: <Backpack />, name: "Works", path: "/works", element: <Works /> },
        {
          icon: <Users />,
          name: "Employees",
          path: "/client/employees",
          element: <Employees />,
        },
      ],
    },
    // {
    //   label: "Favorites",
    //   items: [
    //     { icon: <Megaphone />, name: "Marketing Strategy", path: "/marketing-strategy", element: <MarketingStrategy /> },
    //     { icon: <Building2 />, name: "Alfala Building", path: "/alfala-building", element: <AlfalaBuilders /> },
    //     { icon: <Store />, name: "Timo's Super Shop", path: "/timos-super-shop", element: <TimosSuperShop /> },
    //   ],
    // },
    {
      label: "Programs & Projects",
      items: [
        {
          icon: <LayoutGrid />,
          name: "All Program",
          path: "/client/all-program",
          element: <AllProgram />,
        },
        /* {
          icon: <IoExtensionPuzzleOutline className="size-6" />,
          name: "Program Builder",
          path: "/program-builder",
          element: <ProgramBuilder />,
        }, */
        /* {
          icon: <BriefcaseBusiness />,
          name: "Program Name",
          path: "/program-name",
          element: <ProgramName />,
          hidden: showHighwayExpansion,
        }, */
        /* {
          icon: <BriefcaseBusiness />,
          name: (
            <span className="text-[15px]">Highway Expansion</span>
          ),
          className: "text-sm",
          path: "/highway-expansion",
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
        }, */
        /* {
          icon: <FileChartColumnIncreasing />,
          name: "Project Review",
          path: "/project-review",
          element: <ProjectReview />,
        }, */
        /* {
          icon: <Grid2x2 />,
          name: "Project Builder",
          path: "/project-builder",
          element: <ProjectBuilder />,
        }, */
      ].filter((item) => item), // here add this code .filter((item) => !item.hidden),
    },
    {
      label: "Support",
      items: [
        /* {
          icon: <Clipboard />,
          name: "Activity Log",
          path: "/activity-log",
          element: <ActivityLog />,
        }, */
        /* {
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
            {
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
            },
          ],
        }, */
        /* {
          icon: <IoSettingsOutline className="size-6" />,
          name: "Settings",
          path: "/settings",
          element: <Settings />,
        }, */
      ],
    },
  ];
};
