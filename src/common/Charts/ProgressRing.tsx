import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import ChartCardWrapper from "./components/ChartCardWrapper";

/*       TYPES       */

export type ChartData = {
  name: string;
  value: number;
  color: string;
};

type LegendValue = {
  label: string;
  field: string;
  color: string;
};

export type TierChart = {
  id: string;
  name: string;
  legendValues: LegendValue[];
  children: TierChart[];
};

type Props = {
  widgetTitle?: string;
  legendValues?: LegendValue[];
  numOfLegendDataSet?: number;
  startingRange?: number;
  endingRange?: number;
  onToggleWidget?: () => void;
  onDelete?: () => void;
  tierLevel?: number;
  chartId?: string;
  isPreview?: boolean;
};

/*       HELPER FUNCTIONS       */

const generateId = () =>
  crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 10);

const getRandomValue = (min = 0, max = 100) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/*       COMPONENT       */

export default function ProgressRing({
  widgetTitle = "My CSV",
  legendValues = [],
  numOfLegendDataSet = 1,
  startingRange = 0,
  endingRange = 100,
  onToggleWidget,
  onDelete,
  tierLevel = 0,
  chartId = "root",
  isPreview = false,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  // Tier management states
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [childTiers, setChildTiers] = useState<TierChart[]>([]);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  const [getChartTitleId] = useGetChartTitleIdMutation();

  /*   DATA   */
  const chartData: ChartData[] = useMemo(() => {
    return legendValues
      .filter((l) => l.label)
      .map((l) => ({
        name: l.label,
        value: getRandomValue(5, 100),
        color: l.color,
      }));
  }, [legendValues]);

  const isAllLegendFieldEmpty = legendValues.filter((l) => l.field !== "");

  /*   ACTIONS   */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(chartData, null, 2));
  };

  const handleDownload = () => {
    const csvId = generateId();

    const payload = {
      numberOfDataset: numOfLegendDataSet,
      firstFieldDataset: startingRange,
      lastFieldDataset: endingRange,
      showWidgets: legendValues.map((l) => ({
        legend_name: l.label,
        color: l.color,
      })),
      title: widgetTitle,
      status: "ACTIVE",
      category: "PROGRESS_RING",
      xAxis: JSON.stringify({
        labels: [],
        values: [],
      }),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({}),
    };
    setIsDownloading(true);

    // For CSV export with just labels
    const header = "Label,Value";
    const rows = legendValues.map((l) => `${l.label},`);
    const csv = [header, ...rows].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${widgetTitle}-${csvId}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    // Also save to backend
    DownloadAndSaveCSVforModuleOneWidget(
      payload,
      getChartTitleId,
      widgetTitle,
      [],
      legendValues,
    );

    setIsDownloading(false);
  };

  const handleAddTierClick = () => {
    setShowAddTierModal(true);
  };

  const handleSaveTier = (tierName: string) => {
    const newTier: TierChart = {
      id: `${chartId}-tier-${Date.now()}`,
      name: tierName,
      legendValues: legendValues,
      children: [],
    };
    setChildTiers([...childTiers, newTier]);
    setShowAddTierModal(false);
  };

  const handleChartClick = () => {
    if (childTiers.length > 0) {
      setShowChildrenModal(true);
    }
  };

  /*   RENDER   */

  return (
    <>
      <ChartCardWrapper
        title={widgetTitle}
        chartId={chartId}
        tierLevel={tierLevel}
        onHeaderClick={handleChartClick}
        menuActions={{
          onCopy: handleCopy,
          onDownload: handleDownload,
          onDelete: onDelete,
          onAddTier: handleAddTierClick,
          onToggleWidget: onToggleWidget,
        }}
        isDownloading={isDownloading}
        isPreview={isPreview}
        customHeaderContent={
          <div className="flex gap-6 justify-center">
            {legendValues.map(
              (l) =>
                l.label && (
                  <div key={l.field} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: l.color }}
                    />
                    <span className="text-sm">{l.label}</span>
                  </div>
                ),
            )}
          </div>
        }
        footer={
          childTiers.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium text-center">
              Click chart to view {childTiers.length} child tier
              {childTiers.length > 1 ? "s" : ""}
            </p>
          ) : undefined
        }
      >
        <div className="relative">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="99%"
                paddingAngle={1}
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          {isAllLegendFieldEmpty.length !== 0 ? (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-3xl font-bold">{legendValues.length}</p>
            </div>
          ) : (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 text-center">
              No data available.
            </div>
          )}
        </div>
      </ChartCardWrapper>

      {/* Add Tier Modal */}
      <AddTierModal
        isOpen={showAddTierModal}
        onClose={() => setShowAddTierModal(false)}
        onSave={handleSaveTier}
        parentChartName={widgetTitle}
      />

      {/* Children Grid Modal */}
      {showChildrenModal && (
        <TierChartModal
          isOpen={showChildrenModal}
          onClose={() => setShowChildrenModal(false)}
          tierLevel={tierLevel + 1}
          title={widgetTitle}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {childTiers.map((tier) => (
              <ProgressRing
                key={tier.id}
                widgetTitle={tier.name}
                legendValues={tier.legendValues}
                numOfLegendDataSet={tier.legendValues.length}
                startingRange={startingRange}
                endingRange={endingRange}
                tierLevel={tierLevel + 1}
                chartId={tier.id}
                isPreview={isPreview}
                onDelete={onDelete}
              />
            ))}
          </div>
        </TierChartModal>
      )}
    </>
  );
}
