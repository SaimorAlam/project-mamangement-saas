import {
  ChartPie,
  FileChartColumnIncreasing,
  Folder,
  Grid2x2,
  Headphones,
  Info,
  Milestone,
  Phone,
  UserStar,
  Ticket,
  TicketPlus,
  Megaphone,
  Building2,
  Store,
} from "lucide-react";
import { IoSettingsOutline } from "react-icons/io5";

interface SidebarItem {
  icon?: React.ReactElement;
  name?: string;
  path?: string;
  hidden?: boolean;
  children?: SidebarItem[];
  index?: boolean;
}

interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

export const getStaffManagerSidebarItems = (): SidebarGroup[] => {
  return [
    {
      label: "Main Menu",
      items: [
        {
          icon: <ChartPie />,
          name: "Overview",
          path: "/staff-manager-panel",
        },
        {
          icon: <Folder />,
          name: "Projects",
          path: "/staff-manager-panel/projects",
        },
        {
          icon: <Grid2x2 />,
          name: "Project Builder",
          path: "/staff-manager-panel/project-builder",
        },
        {
          icon: <FileChartColumnIncreasing />,
          name: "Project Review",
          path: "/staff-manager-panel/project-review/all-projects",
        },
        // {
        //   icon: <FileChartColumnIncreasing />,
        //   name: "Project Review",
        //   path: "/staff-manager-panel/project-review",
        //   children: [
        //     {
        //       icon: <FileChartColumnIncreasing />,
        //       name: "Project Review",
        //       path: "all-projects",
        //     },
        //     {
        //       icon: <FolderClosed />,
        //       name: "Carlyle Hall",
        //       path: "carlyle-hall",
        //     },
        //   ],
        // },
      ],
    },
    {
      label: "Favorites",
      items: [
        {
          icon: <Megaphone />,
          name: "Marketing Strategy",
          path: "/staff-manager-panel/marketing-strategy",
        },
        {
          icon: <Building2 />,
          name: "Alfala Building",
          path: "/staff-manager-panel/alfala-building",
        },
        {
          icon: <Store />,
          name: "Timo's Super Shop",
          path: "/staff-manager-panel/timos-super-shop",
        },
      ],
    },
    {
      label: "Support",
      items: [
        {
          icon: <Info />,
          name: "Help",
          path: "/staff-manager-panel/help",
          children: [
            {
              icon: <Headphones />,
              path: "support",
              name: "Support",
              children: [
                {
                  index: true,
                  icon: <Ticket />,
                  name: "Support Ticket",
                },
                {
                  icon: <TicketPlus />,
                  path: "create-tickets",
                  name: "Create Ticket",
                },
              ],
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
          path: "/staff-manager-panel/settings",
        },
      ],
    },
  ];
};
