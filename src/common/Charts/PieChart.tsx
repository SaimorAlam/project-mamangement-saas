/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect } from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleTwoWidget } from "@/utils/Download&SaveCSV";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import ChartCardWrapper from "./components/ChartCardWrapper";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useLazyFindChildrenValueQuery } from "@/store/Api/ChartApi/ChartApi";
import {
  setChildPayload,
  setGroupTitle,
} from "@/store/Slices/ChartSlice/ChartSlice";
import { parsePieChartData } from "@/utils/parsePieChartData";
import { chartTypes } from "@/utils/ChartCategory";

/*       TYPES       */

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

export type BreadcrumbItem = {
  id: string;
  name: string;
  level: number;
};

type Props = {
  widgetTitle?: string;
  legendValues?: LegendValue[];
  numOfLegendDataSet?: number;
  onToggleWidget?: () => void;
  onDelete?: () => void;
  tierLevel?: number;
  chartId?: string;
  isPreview?: boolean;
  allUploadedData?: ChartData[];
  projectId?: string;
  breadcrumbPath?: BreadcrumbItem[];
  onNavigate?: (level: number) => void;
};

/*       HELPER FUNCTIONS       */

const getRandomValue = (min = 0, max = 100) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/*       COMPONENT       */

export default function PieChartWidget({
  widgetTitle = "My CSV",
  legendValues = [],
  numOfLegendDataSet = 1,
  onToggleWidget,
  onDelete,
  tierLevel = 0,
  chartId = "root",
  isPreview = false,
  allUploadedData,
  projectId,
  breadcrumbPath = [],
  onNavigate,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const dispatch = useAppDispatch();
  const groupTitle = useAppSelector((state) => state.chartSlice.groupTitle);

  const [findChildrenValue, { data, isLoading }] =
    useLazyFindChildrenValueQuery();

  const childTiers = data?.data;

  useEffect(() => {
    if (chartId && chartId !== "root") {
      findChildrenValue(chartId);
    }
  }, [chartId, findChildrenValue]);

  // Tier management states
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  const [getChartTitleId] = useGetChartTitleIdMutation();

  const currentBreadcrumbs = useMemo(() => {
    const base =
      breadcrumbPath.length === 0
        ? [{ id: "dashboard", name: "Dashboard", level: -1 }]
        : breadcrumbPath;
    return [
      ...base,
      { id: chartId || "root", name: widgetTitle, level: tierLevel },
    ];
  }, [breadcrumbPath, chartId, widgetTitle, tierLevel]);

  const handleChildNavigate = (targetLevel: number) => {
    if (targetLevel < tierLevel) {
      setShowChildrenModal(false);
      if (onNavigate) onNavigate(targetLevel);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const target = currentBreadcrumbs[index];
    if (index < currentBreadcrumbs.length - 1) {
      if (onNavigate) {
        onNavigate(target.level);
      }
      setShowChildrenModal(false);
    }
  };

  /*   DATA   */
  const chartData: ChartData[] = useMemo(() => {
    if (allUploadedData && allUploadedData.length > 0) {
      return allUploadedData;
    }
    return legendValues
      .filter((l) => l.label)
      .map((l) => ({
        name: l.label,
        value: getRandomValue(10, 100),
        color: l.color,
      }));
  }, [legendValues, allUploadedData]);

  const isAllLegendFieldEmpty = legendValues.filter((l) => l.field !== "");

  /*   ACTIONS   */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(chartData, null, 2));
  };

  const handleDownload = () => {
    const payload = {
      numberOfDataset: numOfLegendDataSet,
      firstFieldDataset: 0,
      lastFieldDataset: 100,
      widgets: legendValues.map((l) => ({
        legendName: l.label,
        color: l.color,
      })),
      title: widgetTitle,
      status: "ACTIVE",
      category: "PIE",
      xAxis: JSON.stringify([
        ["Legend", "Value"],
        ...legendValues.map((l) => [l.label, 0]),
      ]),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({}),
      projectId: projectId,
    };
    setIsDownloading(true);

    DownloadAndSaveCSVforModuleTwoWidget(
      payload,
      getChartTitleId,
      widgetTitle,
      legendValues,
    );

    setIsDownloading(false);
  };

  const handleAddTierClick = () => {
    if (tierLevel === 0) {
      dispatch(setGroupTitle(widgetTitle));
    }
    const childPayload = {
      numberOfDataset: numOfLegendDataSet,
      firstFieldDataset: 0,
      lastFieldDataset: 100,
      widgets: legendValues.map((l) => ({
        legendName: l.label,
        color: l.color,
      })),
      title: "",
      status: "ACTIVE",
      category: "PIE",
      xAxis: JSON.stringify([
        ["Legend", "Value"],
        ...legendValues.map((l) => [l.label, 0]),
      ]),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({}),
      projectId: projectId,
      parentId: chartId,
      rootchart: false,
      roottitle: widgetTitle,
      grouptitle: tierLevel === 0 ? widgetTitle : groupTitle,
    };
    dispatch(setChildPayload(childPayload));
    setShowAddTierModal(true);
  };

  const handleChartClick = () => {
    if (childTiers?.length > 0) {
      setShowChildrenModal(true);
      if (tierLevel === 0) {
        dispatch(setGroupTitle(widgetTitle));
      }
    }
  };

  /*   TOOLTIP & LABEL   */
  const renderCustomLabel = (props: PieLabelRenderProps) => {
    const payload = props.payload as { name: string; value: number };
    return `${payload.name}: ${payload.value}%`;
  };

  /*   RENDER   */
  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse">
        <div className="text-gray-400 text-sm font-medium">
          Loading child tiers...
        </div>
      </div>
    );
  }

  return (
    <>
      <ChartCardWrapper
        title={widgetTitle}
        subtitle="Distribution Analysis"
        chartId={chartId || "root"}
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
          <div className="flex gap-4">
            {chartData.slice(0, 3).map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-500 font-medium">
                  {item.name}
                </span>
              </div>
            ))}
            {chartData.length > 3 && (
              <span className="text-xs text-gray-400">
                +{chartData.length - 3} more
              </span>
            )}
          </div>
        }
        footer={
          childTiers?.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium">
              Click chart to view {childTiers?.length} child tier
              {childTiers?.length > 1 ? "s" : ""}
            </p>
          ) : undefined
        }
      >
        <div className="relative">
          <ResponsiveContainer width="100%" height={400}>
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={"90%"}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </RechartsPieChart>
          </ResponsiveContainer>

          {isAllLegendFieldEmpty.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium border-2 border-dashed border-gray-100 rounded-xl">
              No data available. Please configure the widget.
            </div>
          )}
        </div>
      </ChartCardWrapper>

      <AddTierModal
        isOpen={showAddTierModal}
        onClose={() => setShowAddTierModal(false)}
        chartId={chartId}
        parentChartName={tierLevel === 0 ? widgetTitle : groupTitle}
      />

      {showChildrenModal && (
        <TierChartModal
          isOpen={showChildrenModal}
          onClose={() => setShowChildrenModal(false)}
          tierLevel={tierLevel + 1}
          title={widgetTitle}
          breadcrumbs={currentBreadcrumbs}
          onBreadcrumbClick={handleBreadcrumbClick}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {childTiers?.map((tier: any) => {
              const chartWidget = chartTypes[tier.category];
              const tierLegends = (tier?.[chartWidget]?.widgets || []).map(
                (w: any) => ({
                  label: w.legendName || w.label,
                  field: (w.legendName || w.label)
                    ?.toLowerCase()
                    .replace(/\s+/g, ""),
                  color: w.color,
                }),
              );

              const pieData = parsePieChartData(tier.xAxis, tierLegends);

              return (
                <PieChartWidget
                  key={tier.id}
                  widgetTitle={tier.title || tier.name || "Untitled Tier"}
                  legendValues={tierLegends}
                  numOfLegendDataSet={tierLegends.length}
                  tierLevel={tierLevel + 1}
                  chartId={tier.id}
                  isPreview={isPreview}
                  allUploadedData={pieData}
                  projectId={tier.projectId}
                  breadcrumbPath={currentBreadcrumbs}
                  onNavigate={handleChildNavigate}
                />
              );
            })}
          </div>
        </TierChartModal>
      )}
    </>
  );
}
