import StaffManagerOverview from "@/pages/staffManager/StaffManagerOverview";
import StaffManagerProjects from "@/pages/staffManager/StaffManagerProjects";
import StaffManagerMarketingStrategy from "@/pages/staffManager/StaffManagerMarketingStrategy";
import StaffManagerTimosSuperShop from "@/pages/staffManager/StaffManagerTimosSuperShop";
import StaffManagerProgramName from "@/pages/staffManager/StaffManagerProgramName";
// import StaffManagerProjectBuilder from "@/pages/staffManager/StaffManagerProjectBuilder";
import StaffManagerHighwayExpansion from "@/pages/staffManager/StaffManagerHighwayExpansion";
// import StaffManagerProjectReview from "@/pages/staffManager/StaffManagerProjectReview";
import StaffManagerHelp from "@/pages/staffManager/StaffManagerHelp";
import StaffManagerSupport from "@/pages/staffManager/StaffManagerSupport";
import StaffManagerSupportTickets from "@/pages/staffManager/StaffManagerSupportTickets";
import StaffManagerFeedback from "@/pages/staffManager/StaffManagerFeedBack";
import StaffManagerProductTour from "@/pages/staffManager/StaffManagerProductTour";
import StaffManagerSettings from "@/pages/staffManager/StaffManagerSettings";
import StaffManagerWorkInProgress from "@/pages/staffManager/StaffManagerWorkInProgress";
import StaffManagerUserActivityLog from "@/pages/staffManager/StaffManagerUsersActivityLog";
import StaffManagerCarlyleHall from "@/pages/staffManager/StaffManagerCarlyleHall";
import StaffManagerEmployees from "@/pages/staffManager/StaffManagerEmployees";
import StaffManagerAlfalaBuilders from "@/pages/staffManager/StaffManagerAlfalaBuilders";
import StaffManagerAllProgram from "@/pages/staffManager/StaffManagerAllProgram";
import StaffManagerActivityLog from "@/pages/staffManager/StaffManagerActivityLog";
import StaffManagerCreateTicket from "@/pages/staffManager/StaffManagerCreateTicket";
import StaffManagerContactUs from "@/pages/staffManager/StaffManagerContactUs";
// import CommingSoonPage from "@/common/CommingSoonPage";
import StaffManagerStateCardDetails from "@/pages/staffManager/StaffManagerStateCardDetails";
import StaffManagerUploadSubmission from "@/pages/staffManager/StaffManagerUploadSubmission";
import AllProjectsReview from "@/pages/staffManager/AllProjectsReview";
// import StaffManagerProjectDetail from "@/pages/staffManager/StaffManagerProjectDetail";
import StaffManagerProgramOverview from "@/pages/staffManager/Program/StaffManagerProgramOverview";
import DashboardCardProjects from "@/pages/staffManager/DashboardCardProjects";
import ClientProjectBuilder from "@/pages/client/ProjectBuilder/ClientProjectBuilder";
import ProfilePage from "@/pages/commonPage/ProfilePage";
import ClientProjectBuilderContainer from "@/pages/client/ProjectBuilder/ClientProjectBuilderContainer";
import PublishProject from "@/pages/client/ProjectBuilder/Components/PublishProject";
import FileUpload from "@/pages/client/ProjectBuilder/Components/FileUpload";
import ProjectDetails from "@/pages/client/ProjectDetails/ProjectDetails";

export function getStaffManagerRoutes() {
  return [
    { index: true, element: <StaffManagerOverview /> },
    { path: "projects", element: <StaffManagerProjects /> },
    // { path: "projects/:id", element: <StaffManagerProjectDetail /> },
    { path: "projects/:id", element: <ProjectDetails /> },
    { path: "projects/status/:status", element: <DashboardCardProjects /> },
    {
      path: "projects/upload-submission",
      element: <StaffManagerUploadSubmission />,
    },
    { path: "carlyle-hall", element: <StaffManagerCarlyleHall /> },
    { path: "employees", element: <StaffManagerEmployees /> },
    {
      path: "marketing-strategy",
      element: <StaffManagerMarketingStrategy />,
    },
    { path: "alfala-building", element: <StaffManagerAlfalaBuilders /> },
    {
      path: "timos-super-shop",
      element: <StaffManagerTimosSuperShop />,
    },
    { path: "all-program", element: <StaffManagerAllProgram /> },
    { path: "program/:id", element: <StaffManagerProgramOverview /> },

    { path: "program-name", element: <StaffManagerProgramName /> },
    // {
    //   path: "project-builder",
    //   element: <ClientProjectBuilder />,
    //   // element: <StaffManagerProjectBuilder />,
    // },
    {
      path: "project-builder",
      element: <ClientProjectBuilderContainer />,
      children: [
        { index: true, element: <ClientProjectBuilder /> },
        { path: "publish", element: <PublishProject /> },
        { path: "file-upload", element: <FileUpload /> },
        { path: "project-details/:projectId", element: <ProjectDetails /> },
      ],
    },
    {
      path: "highway-expansion",
      element: <StaffManagerHighwayExpansion />,
    },
    {
      path: "project-review",
      element: <AllProjectsReview />,
    },
    // {
    //   path: "project-review",
    //   element: <StaffManagerProjectReview />,
    //   children: [
    //     { path: "all-projects", element: <AllProjectsReview /> },
    //     { path: "carlyle-hall", element: <StaffManagerCarlyleHall /> },
    //   ],
    // },
    { path: "activity-log", element: <StaffManagerActivityLog /> },
    {
      path: "help",
      element: <StaffManagerHelp />,
      children: [
        {
          path: "support",
          element: <StaffManagerSupport />,
          children: [
            { index: true, element: <StaffManagerSupportTickets /> },
            { path: "create-tickets", element: <StaffManagerCreateTicket /> },
          ],
        },
        { path: "feedback", element: <StaffManagerFeedback /> },
        {
          path: "product-tour",
          element: <StaffManagerProductTour />,
        },
        { path: "contact-us", element: <StaffManagerContactUs /> },
      ],
    },
    { path: "settings", element: <StaffManagerSettings /> },
    {
      path: "work-in-progress",
      element: <StaffManagerWorkInProgress />,
    },
    {
      path: "user-activity-log",
      element: <StaffManagerUserActivityLog />,
    },
    {
      path: "state-card/:cardTitle",
      element: <StaffManagerStateCardDetails />,
    },
    { path: "profile", element: <ProfilePage /> },
  ];
}
