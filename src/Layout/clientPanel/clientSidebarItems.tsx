import {
  // Backpack,
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
  // Ticket,
  // TicketPlus,
} from "lucide-react";
import { IoExtensionPuzzleOutline, IoSettingsOutline } from "react-icons/io5";
import { ISidebarItem } from "@/types";

interface SidebarGroup {
  label: string;
  items: ISidebarItem[];
}

export const getClientSidebarItems = (): SidebarGroup[] => {
  const showHighwayExpansion = true;
  // You can replace 'true' with actual logic to determine visibility

  return [
    {
      label: "Main Menu",
      items: [
        {
          icon: <ChartPie />,
          name: "Overview",
          path: "/client-panel",
        },
        // {
        //   icon: <Backpack />,
        //   name: "Works",
        //   path: "/client-panel/works",
        // },
        {
          icon: <Users />,
          name: "Employees",
          path: "/client-panel/employees",
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
        },
        {
          icon: <Building2 />,
          name: "Alfala Building",
          path: "/client-panel/alfala-building",
        },
        {
          icon: <Store />,
          name: "Timo's Super Shop",
          path: "/client-panel/timos-super-shop",
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
        },
        {
          icon: <IoExtensionPuzzleOutline className="size-6" />,
          name: "Program Builder",
          path: "/client-panel/program-builder",
        },
        {
          icon: <BriefcaseBusiness />,
          name: "Program Name",
          path: "/client-panel/program-name",
          hidden: showHighwayExpansion,
        },
        {
          icon: <BriefcaseBusiness />,
          name: <span className="text-[15px]">Highway Expansion</span>,
          className: "text-sm",
          path: "/client-panel/highway-expansion",
          hidden: !showHighwayExpansion,
          children: [
            {
              icon: <FileChartColumnIncreasing />,
              name: "Highway Expansion",
              path: "all-highway",
            },
            {
              icon: <FolderClosed />,
              name: "Carlyle Hall",
              path: "carlyle-hall",
            },
          ],
        },
        {
          icon: <FileChartColumnIncreasing />,
          name: "Project Review",
          path: "/client-panel/project-review",
        },
        {
          icon: <Grid2x2 />,
          name: "Project Builder",
          path: "/client-panel/project-builder",
        },
      ].filter((item) => !item.hidden),
    },
    {
      label: "Support",
      items: [
        {
          icon: <Clipboard />,
          name: "Activity Log",
          path: "/client-panel/activity-log",
        },
        {
          icon: <Info />,
          name: "Help",
          path: "/client-panel/help",
          children: [
            {
              icon: <Headphones />,
              path: "support",
              name: "Support",
              // children: [
              //   {
              //     index: true,
              //     icon: <Ticket />,
              //     name: "Support Ticket",
              //   },
              //   {
              //     icon: <TicketPlus />,
              //     path: "create-tickets",
              //     name: "Create Ticket",
              //   },
              // ],
            },
            {
              icon: <UserStar />,
              path: "feedback",
              name: "Feedback",
            },
            {
              icon: <Milestone />,
              path: "product-tour",
              name: "Product Tour",
            },
            {
              icon: <Phone />,
              path: "contact-us",
              name: "Contact US",
            },
          ],
        },
        {
          icon: <IoSettingsOutline className="size-6" />,
          name: "Settings",
          path: "/client-panel/settings",
        },
        {
          icon: <IoSettingsOutline className="size-6" />,
          name: "Create Project",
          path: "/client-panel/single-project-create",
        },
      ],
    },
  ];
};
