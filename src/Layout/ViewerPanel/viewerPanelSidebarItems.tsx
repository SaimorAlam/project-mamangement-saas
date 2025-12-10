import {
  // Building2,
  ChartPie,
  Folder,
  Headphones,
  Info,
  // Megaphone,
  Milestone,
  Phone,
  // Store,
  UserStar,
  Ticket,
  TicketPlus,
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

export const getViewerPanelSidebarItems = (): SidebarGroup[] => {
  return [
    {
      label: "Main Menu",
      items: [
        {
          icon: <ChartPie />,
          name: "Overview",
          path: "/viewer-panel",
        },
        {
          icon: <Folder />,
          name: "Projects",
          path: "/viewer-panel/projects",
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
      label: "Support",
      items: [
        {
          icon: <Info />,
          name: "Help",
          path: "/viewer-panel/help",
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
          path: "/viewer-panel/settings",
        },
      ],
    },
  ];
};
