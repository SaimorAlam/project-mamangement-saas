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
import * as XLSX from "xlsx";
import { toast } from "sonner";

import AddTierModal from "../../../Modal/AddTierModal";
import TierChartModal from "../../../Modal/TierChartModal";
import ChartCardWrapper from "../../components/ChartCardWrapper";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  useLazyFindChildrenValueQuery,
  useLazyGetAllTheLeafChartQuery,
} from "@/store/Api/ChartApi/ChartApi";
import {
  setChildPayload,
  setGroupTitle,
} from "@/store/Slices/ChartSlice/ChartSlice";
import { parsePieChartData } from "@/utils/parsePieChartData";
import { chartTypes } from "@/utils/ChartCategory";

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
  isCreationMode?: boolean;
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
  isCreationMode = false,
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
  const { chartData, isSampleData } = useMemo(() => {
    // Check if we have real data and at least one non-zero value
    const hasRealData =
      allUploadedData &&
      allUploadedData.length > 0 &&
      allUploadedData.some((item) => item.value > 0);

    if (hasRealData) {
      return { chartData: allUploadedData, isSampleData: false };
    }

    const data = legendValues
      .filter((l) => l.label)
      .map((l) => ({
        name: l.label,
        value: getRandomValue(10, 100),
        color: l.color,
      }));
    return { chartData: data, isSampleData: data.length > 0 };
  }, [legendValues, allUploadedData]);

  /*   ACTIONS   */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(chartData, null, 2));
  };

  const [getAllTheLeafChart] = useLazyGetAllTheLeafChartQuery();

  const handleDownload = async (title: string) => {
    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }
    setIsDownloading(true);
    try {
      const res = await getAllTheLeafChart(projectId as string).unwrap();
      const leafCharts =
        res?.data?.find((item: any) => item.grouptitle === title) || [];

      if (leafCharts.charts?.length === 0) {
        toast.error("No data found to download");
        return;
      }

      const wb = XLSX.utils.book_new();
      const ids: string[] = [];
      const usedNames = new Set<string>();

      const getUniqueSheetName = (name: string, id: string) => {
        const safeName = (name || "Sheet").replace(/[:/?*[\]\\]/g, " ").trim();
        const fullName = `${safeName}_${id}`;
        let finalName =
          fullName.length > 31 ? fullName.substring(0, 31) : fullName;
        let counter = 1;
        while (usedNames.has(finalName.toLowerCase())) {
          const suffix = `_${counter}`;
          const base = fullName.substring(0, 31 - suffix.length);
          finalName = base + suffix;
          counter++;
        }
        usedNames.add(finalName.toLowerCase());
        return finalName;
      };

      leafCharts?.charts?.forEach((node: any) => {
        ids.push(node.id);

        let legends = (node.widgets || []).map((w: any) => ({
          label: w.legendName || w.label || "Legend",
          field: (w.legendName || w.label || "field")
            .toLowerCase()
            .replace(/\s+/g, ""),
          color: w.color || "#000000",
        }));

        if (!legends.length) {
          legends = legendValues;
        }

        // For Pie charts, we use a simple "Label" | "Value" format
        const headers = ["Label", "Value"];

        // For Pie chart, we typically have labels from the xAxis if available,
        // fall back to default template row if not.
        let xAxisLabels: string[] = [];
        if (node.xAxis) {
          try {
            const parsed =
              typeof node.xAxis === "string"
                ? JSON.parse(node.xAxis)
                : node.xAxis;
            if (
              Array.isArray(parsed) &&
              parsed.length > 0 &&
              Array.isArray(parsed[0])
            ) {
              xAxisLabels = parsed.slice(1).map((row: any) => row[0]);
            }
          } catch (e) {
            console.error("Failed to parse xAxis for node", node.id, e);
          }
        }

        if (xAxisLabels.length === 0) {
          xAxisLabels = (node.widgets || []).map(
            (w: any) => w.legendName || w.label || "Slice",
          );
          if (xAxisLabels.length === 0) {
            xAxisLabels = legendValues.map((l) => l.label);
          }
        }

        const rows = xAxisLabels.map((label: string) => [
          label,
          " ", // Single value column for Pie charts
        ]);

        const data = [headers, ...rows];
        const ws = XLSX.utils.aoa_to_sheet(data);
        const sheetName = getUniqueSheetName(
          node.title || node.name || "Tier",
          node.id,
        );
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });

      const filename = `${widgetTitle}_ID_${ids.join("_")}.xlsx`;
      XLSX.writeFile(wb, filename);
      toast.success("Excel downloaded successfully");
    } catch (error) {
      console.error("Excel download failed", error);
      toast.error("Failed to download Excel");
    } finally {
      setIsDownloading(false);
    }
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
    return `${payload.name}: ${payload.value}`;
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
        subtitle={`Distribution Analysis ${isSampleData ? "(Sample Data)" : ""}`}
        tierLevel={tierLevel}
        onHeaderClick={handleChartClick}
        menuActions={{
          onCopy: handleCopy,
          onDownload: () =>
            handleDownload(tierLevel === 0 ? widgetTitle : groupTitle),
          onDelete: onDelete,
          onAddTier: !isCreationMode ? handleAddTierClick : undefined,
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
                labelLine={true}
                label={renderCustomLabel}
                innerRadius={60}
                outerRadius={100} // Slightly reduced to give labels more perimeter room
                paddingAngle={2} // Space between slices
                dataKey="value"
                minAngle={25} // Increased to ensure zero-value slices have enough arc to separate labels
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}`} />
            </RechartsPieChart>
          </ResponsiveContainer>
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
                  isCreationMode={false}
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
