import React, { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import SheetTab from "./AllDataTab/SheetTab";
import GanttTab from "./AllDataTab/GanttTab";
import DashboardTab from "./AllDataTab/DashboardTab";
import FileTab from "./AllDataTab/FileTab";
import RaidLogTab from "./AllDataTab/RaidLogTab";

const ProjectDetails: React.FC = () => {
  const location = useLocation();
  const isViewerPanel = location.pathname.includes("/viewer-panel");

  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";



  useEffect(() => {
    if (!isViewerPanel && activeTab) {
      localStorage.setItem("activeCarlyleTab", activeTab);
    }
  }, [activeTab, isViewerPanel]);

  return (
    <div className="min-h-screen bg-white">
      {/* Tabs handled by ClientDashboardHeader */}

      {/* Tab Content */}
      <div>
        {isViewerPanel ? (
          <DashboardTab />
        ) : (
          <>
            {activeTab === "sheet" && <SheetTab />}
            {activeTab === "gantt" && <GanttTab />}
            {activeTab === "dashboard" && <DashboardTab />}
            {activeTab === "files" && <FileTab />}
            {activeTab === "raidlog" && <RaidLogTab />}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
