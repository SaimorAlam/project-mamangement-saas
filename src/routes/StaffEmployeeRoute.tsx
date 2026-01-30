import StaffEmployeeOverview from "@/pages/staffEmployee/StaffEmployeeOverview";
import StaffEmployeeProjects from "@/pages/staffEmployee/StaffEmployeeProjects";
import StaffEmployeeCarlyleHall from "@/pages/staffEmployee/StaffEmployeeCarlyleHall";
import StaffEmployeeEmployees from "@/pages/staffEmployee/StaffEmployeeEmployees";
import StaffEmployeeMarketingStrategy from "@/pages/staffEmployee/StaffEmployeeMarketingStrategy";
import StaffEmployeeAlfalaBuilders from "@/pages/staffEmployee/StaffEmployeeAlfalaBuilders";
import StaffEmployeeTimosSuperShop from "@/pages/staffEmployee/StaffEmployeeTimosSuperShop";
import StaffEmployeeAllProgram from "@/pages/staffEmployee/StaffEmployeeAllProgram";
import StaffEmployeeProgramName from "@/pages/staffEmployee/StaffEmployeeProgramName";
import StaffEmployeeHighwayExpansion from "@/pages/staffEmployee/StaffEmployeeHighwayExpansion";
import StaffEmployeeProjectReview from "@/pages/staffEmployee/StaffEmployeeProjectReview";
import StaffEmployeeHelp from "@/pages/staffEmployee/StaffEmployeeHelp";
import StaffEmployeeSupport from "@/pages/staffEmployee/StaffEmployeeSupport";
import StaffEmployeeSupportTickets from "@/pages/staffEmployee/StaffEmployeeSupportTickets";
import StaffEmployeeFeedback from "@/pages/staffEmployee/StaffEmployeeFeedBack";
import StaffEmployeeProductTour from "@/pages/staffEmployee/StaffEmployeeProductTour";
import StaffEmployeeSettings from "@/pages/staffEmployee/StaffEmployeeSettings";
import StaffEmployeeWorkInProgress from "@/pages/staffEmployee/StaffEmployeeWorkInProgress";
import StaffEmployeeUserActivityLog from "@/pages/staffEmployee/StaffEmployeeUsersActivityLog";
import StaffEmployeeActivityLog from "@/pages/staffEmployee/StaffEmployeeActivityLog";
import StaffEmployeeContactUs from "@/pages/staffEmployee/StaffEmployeeContactUs";
import StaffEmployeeCreateTicket from "@/pages/staffEmployee/StaffEmployeeCreateTicket";
import StaffEmployeeStateCardDetails from "@/pages/staffEmployee/StaffEmployeeStateCardDetails";
import StaffEmployeeProjectDetail from "@/pages/staffEmployee/StaffEmployeeProjectDetail";
import UploadProject from "@/components/staffEmployee/Projects/UploadProject";

export default function getStaffEmployeeRoutes() {
  return [
    { index: true, element: <StaffEmployeeOverview /> },
    { path: "projects", element: <StaffEmployeeProjects /> },
    { path: "upload-submission", element: <UploadProject /> },
    { path: "carlyle-hall", element: <StaffEmployeeCarlyleHall /> },
    { path: "employees", element: <StaffEmployeeEmployees /> },
    {
      path: "marketing-strategy",
      element: <StaffEmployeeMarketingStrategy />,
    },
    {
      path: "alfala-building",
      element: <StaffEmployeeAlfalaBuilders />,
    },
    {
      path: "timos-super-shop",
      element: <StaffEmployeeTimosSuperShop />,
    },
    { path: "all-program", element: <StaffEmployeeAllProgram /> },
    { path: "program-name", element: <StaffEmployeeProgramName /> },
    {
      path: "highway-expansion",
      element: <StaffEmployeeHighwayExpansion />,
    },
    {
      path: "project-review",
      element: <StaffEmployeeProjectReview />,
    },
    { path: "activity-log", element: <StaffEmployeeActivityLog /> },
    {
      path: "help",
      element: <StaffEmployeeHelp />,
      children: [
        {
          path: "support",
          element: <StaffEmployeeSupport />,
          children: [
            { index: true, element: <StaffEmployeeSupportTickets /> },
            {
              path: "create-tickets",
              element: <StaffEmployeeCreateTicket />,
            },
          ],
        },
        { path: "feedback", element: <StaffEmployeeFeedback /> },
        {
          path: "product-tour",
          element: <StaffEmployeeProductTour />,
        },
        { path: "contact-us", element: <StaffEmployeeContactUs /> },
      ],
    },
    { path: "settings", element: <StaffEmployeeSettings /> },
    {
      path: "work-in-progress",
      element: <StaffEmployeeWorkInProgress />,
    },
    {
      path: "user-activity-log",
      element: <StaffEmployeeUserActivityLog />,
    },
    {
      path: "state-card/:cardTitle",
      element: <StaffEmployeeStateCardDetails />,
    },
    {
      path: "projects/:id",
      element: <StaffEmployeeProjectDetail />,
    },
  ];
}
