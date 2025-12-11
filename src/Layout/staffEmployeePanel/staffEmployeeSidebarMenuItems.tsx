// Removed all page/component imports that were only used for `element`
import {
  // Building2,
  ChartPie,
  FileChartColumnIncreasing,
  Folder,
  Headphones,
  Info,
  // Megaphone,
  Milestone,
  Phone,
  // Store,
  UserStar,
} from "lucide-react";
import { IoSettingsOutline } from "react-icons/io5";

interface SidebarItem {
  icon?: React.ReactElement;
  name?: string;
  path?: string;
  // element removed
  hidden?: boolean;
  children?: SidebarItem[];
  index?: boolean;
}

interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

export const getStaffEmployeeSidebarItems = (): SidebarGroup[] => {
  return [
    {
      label: "Main Menu",
      items: [
        {
          icon: <ChartPie />,
          name: "Overview",
          path: "/",
          // element removed
        },
        {
          icon: <Folder />,
          name: "Projects",
          path: "/projects",
          // element removed
        },
        {
          icon: <FileChartColumnIncreasing />,
          name: "Project Review",
          path: "/project-review",
          // element removed
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
          path: "/help",
          // element removed
          children: [
            {
              icon: <Headphones />,
              path: "support",
              name: "Support",
              // element removed
              children: [
                { index: true /* element removed */ },
                { path: "create-tickets" /* element removed */ },
              ],
            },
            {
              icon: <UserStar />,
              path: "feedback",
              name: "Feedback",
              // element removed
            },
            {
              icon: <Milestone />,
              path: "product-tour",
              name: "Product Tour",
              // element removed
            },
            {
              icon: <Phone />,
              path: "contact-us",
              name: "Contact US",
              // element removed
            },
          ],
        },
        {
          icon: <IoSettingsOutline className="size-6" />,
          name: "Settings",
          path: "/settings",
          // element removed
        },
      ],
    },
  ];
};
