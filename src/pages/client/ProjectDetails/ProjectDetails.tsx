import React, { useState, useEffect } from "react";
import { List, LayoutGrid, Clock, FileText, AlertTriangle } from "lucide-react";
import { useLocation } from "react-router-dom";
import SheetTab from "./AllDataTab/SheetTab";
import GanttTab from "./AllDataTab/GanttTab";
import DashboardTab from "./AllDataTab/DashboardTab";
import FileTab from "./AllDataTab/FileTab";
import RaidLogTab from "./AllDataTab/RaidLogTab";

const ProjectDetails: React.FC = () => {
  const location = useLocation();
  const isViewerPanel = location.pathname.includes("/viewer-panel");

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (isViewerPanel) return "dashboard";
    return localStorage.getItem("activeCarlyleTab") || "dashboard";
  });

  const tabs = [
    { id: "gantt", name: "Gantt", icon: List },
    { id: "sheet", name: "Sheet", icon: LayoutGrid },
    { id: "dashboard", name: "Dashboard", icon: Clock },
    { id: "files", name: "Files", icon: FileText },
    { id: "raidlog", name: "Raid Log", icon: AlertTriangle },
  ];

  useEffect(() => {
    if (!isViewerPanel) {
      localStorage.setItem("activeCarlyleTab", activeTab);
    }
  }, [activeTab, isViewerPanel]);

  return (
    <div className="min-h-screen bg-white">
      {/* Tabs Navigation */}
      {!isViewerPanel && (
        <div className="border-gray-200 bg-white px-6 mb-6">
          <div className="flex items-center justify-center gap-1">
            <div className="flex border border-gray-200 rounded-lg space-x-2 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors rounded-lg cursor-pointer ${
                      activeTab === tab.id
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
