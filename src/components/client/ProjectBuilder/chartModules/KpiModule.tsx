import { useState } from "react";
import DashboardPanelStatsCard from "@/common/DashboardPanelStatsCard";
import KPIWidgetConfig from "../Configuration/KPIWidgetConfig";
import { Trash2 } from "lucide-react";
import { IClientPanelStats } from "@/types";

interface KPIItem extends IClientPanelStats {
  id: string;
  config: {
    showIndex: boolean;
    showFooter: boolean;
    showFooterLabel: boolean;
    showFooterButton: boolean;
  };
}

const KpiModule = ({ onDelete }: { onDelete?: () => void }) => {
  const [stats, setStats] = useState<KPIItem[]>([
    {
      id: "1",
      title: "Total Project",
      value: 56,
      growth: "+5%",
      growth_type: "up",
      description: "24 programs running this month",
      link_text: "View all",
      icon: "FolderIcon",
      icon_bg_color: "#059669",
      config: {
        showIndex: true,
        showFooter: true,
        showFooterLabel: true,
        showFooterButton: true,
      },
    },
    {
      id: "2",
      title: "Live Project",
      value: 36,
      growth: "+2%",
      growth_type: "up",
      description: "150 new users joined",
      link_text: "View all",
      icon: "LiveProject",
      icon_bg_color: "#7C3AED",
      config: {
        showIndex: true,
        showFooter: true,
        showFooterLabel: true,
        showFooterButton: true,
      },
    },
    {
      id: "3",
      title: "Project in draft",
      value: 15,
      growth: "+1.1%",
      growth_type: "up",
      description: "5 new clients joined",
      link_text: "View all",
      icon: "ProjectInDraft",
      icon_bg_color: "#2563EB",
      config: {
        showIndex: true,
        showFooter: true,
        showFooterLabel: true,
        showFooterButton: true,
      },
    },
    {
      id: "4",
      title: "Pending Review",
      value: 75,
      growth: "+5%",
      growth_type: "up",
      description: "25 score growth",
      link_text: "View all",
      icon: "PendingReview",
      icon_bg_color: "#059669",
      config: {
        showIndex: true,
        showFooter: true,
        showFooterLabel: true,
        showFooterButton: true,
      },
    },
    {
      id: "5",
      title: "Submission Overdue",
      value: "7.8%",
      growth: "",
      growth_type: "down",
      description: "50 Clients left",
      link_text: "View all",
      icon: "SubmissionOverdue",
      icon_bg_color: "#DC2626",
      config: {
        showIndex: true,
        showFooter: true,
        showFooterLabel: true,
        showFooterButton: true,
      },
    },
  ]);

  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

  const handleUpdateStatConfig = (
    index: number,
    newConfig: Partial<KPIItem["config"]>,
  ) => {
    const updatedStats = [...stats];
    updatedStats[index] = {
      ...updatedStats[index],
      config: { ...updatedStats[index].config, ...newConfig },
    };
    setStats(updatedStats);
  };

  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200 relative group min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">KPI Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={onDelete}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
            title="Remove Module"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {stats.map((item, index) => (
              <div key={item.id} className="relative group/card">
                <DashboardPanelStatsCard
                  item={item}
                  showIndex={item.config.showIndex}
                  showFooter={item.config.showFooter}
                  showFooterLabel={item.config.showFooterLabel}
                  showFooterButton={item.config.showFooterButton}
                  onToggleWidget={() =>
                    setActiveCardIndex(activeCardIndex === index ? null : index)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {activeCardIndex !== null && stats[activeCardIndex] && (
          <div className="w-[340px] shrink-0 sticky top-5 h-fit pb-10">
            <KPIWidgetConfig
              config={stats[activeCardIndex].config}
              setConfig={(
                newConfig: React.SetStateAction<{
                  showIndex: boolean;
                  showFooter: boolean;
                  showFooterLabel: boolean;
                  showFooterButton: boolean;
                }>,
              ) => {
                const currentConfig = stats[activeCardIndex].config;
                const updatedConfig =
                  typeof newConfig === "function"
                    ? newConfig(currentConfig)
                    : newConfig;
                handleUpdateStatConfig(activeCardIndex, updatedConfig);
              }}
              onClose={() => setActiveCardIndex(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiModule;
