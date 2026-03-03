/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { generateChartData } from "@/utils";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import useChartData from "./useChartData";
import ChartCardWrapper from "./CompletedCharts/Common/ChartCardWrapper";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

/*       TYPES       */

export type ChartData = {
  name: string;
  [key: string]: number | string;
};

type LegendValue = {
  label: string;
  field: string;
  color: string;
  type?: "bar" | "line";
};

export type TierChart = {
  id: string;
  name: string;
  xAxisValues: string[];
  legendValues: LegendValue[];
  children: TierChart[];
};

type Props = {
  newData?: any[];
  widgetTitle?: string;
  xAxisValues?: string[];
  legendValues?: LegendValue[];
  numOfLegendDataSet?: number;
  startingRange: number;
  endingRange: number;
  onToggleWidget?: () => void;
  onDelete?: () => void;
  tierLevel?: number;
  chartId?: string;
  isCreationMode?: boolean;
  isPreview?: boolean;
  allUploadedData?: { [key: string]: ChartData[] };
};

export default function ComboChart({
  newData,
  widgetTitle = "Combo Chart",
  xAxisValues = [],
  legendValues = [],
  numOfLegendDataSet = 1,
  startingRange,
  endingRange,
  onToggleWidget,
  onDelete,
  tierLevel = 0,
  chartId,
  isCreationMode = false,
  isPreview = false,
  allUploadedData,
}: Props) {
  const { childTiers } = useChartData({
    newData,
    isCreationMode,
    chartId,
    xAxisValues,
    legendValues,
    numOfLegendDataSet,
    startingRange,
    endingRange,
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  const chartRef = useRef<ChartJS>(null);

  /*   CHART DATA   */
  const chartData: ChartData[] = useMemo(() => {
    const sheetName = (widgetTitle || "Sheet")
      .replace(/[:/?*[\]\\]/g, " ")
      .trim()
      .substring(0, 31);
    const dataToUse = allUploadedData?.[sheetName];

    if (dataToUse && dataToUse.length > 0) {
      return dataToUse;
    }

    if (!xAxisValues.length || !legendValues.length) return [];
    return generateChartData(
      xAxisValues,
      legendValues,
      numOfLegendDataSet,
      startingRange,
      endingRange,
    );
  }, [
    xAxisValues,
    legendValues,
    numOfLegendDataSet,
    startingRange,
    endingRange,
    widgetTitle,
    allUploadedData,
  ]);

  /*   CHART.JS DATA   */
  const data = useMemo(() => {
    const labels = chartData.map((d) => d.name);
    const datasets = legendValues.map((legend) => {
      const dataValues = chartData.map((d) => Number(d[legend.field]) || 0);
      const isLine = legend.type === "line";

      return {
        label: legend.label,
        data: dataValues,
        borderColor: legend.color,
        backgroundColor: isLine ? "transparent" : `${legend.color}CC`, // Add transparency for bars
        type: isLine ? ("line" as const) : ("bar" as const),
        order: isLine ? 0 : 1, // Lines on top, bars behind
        borderWidth: isLine ? 2 : 0,
        pointRadius: isLine ? 3 : 0,
        pointBackgroundColor: isLine ? legend.color : undefined,
      };
    });

    return {
      labels,
      datasets,
    };
  }, [chartData, legendValues]);

  /*   CHART OPTIONS   */
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: true,
          text: widgetTitle,
          font: {
            size: 18,
            weight: 600,
          },
        },
        tooltip: {
          mode: "index" as const,
          intersect: false,
        },
      },
      scales: {
        y: {
          min: startingRange,
          max: endingRange,
          ticks: {
            stepSize: Math.ceil((endingRange - startingRange) / 10),
          },
        },
      },
    }),
    [widgetTitle, startingRange, endingRange],
  );

  /*   ACTIONS   */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(chartData, null, 2));
  };

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      const wb = XLSX.utils.book_new();
      const usedNames = new Set<string>();

      const getUniqueSheetName = (name: string) => {
        let baseName = (name || "Sheet").replace(/[:/?*[\]\\]/g, " ").trim();
        if (baseName.length > 25) baseName = baseName.substring(0, 25);
        if (!baseName) baseName = "Sheet";

        let uniqueName = baseName;
        let counter = 1;
        while (usedNames.has(uniqueName.toLowerCase())) {
          uniqueName = `${baseName}_${counter}`;
          counter++;
        }
        usedNames.add(uniqueName.toLowerCase());
        return uniqueName;
      };

      const processNodeData = (
        name: string,
        xAxis: string[],
        legends: LegendValue[],
      ) => {
        const headers = ["Label", ...legends.map((l) => l.label)];
        const rows = xAxis.map((label) => [label, ...legends.map(() => "")]);
        const data = [headers, ...rows];

        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, getUniqueSheetName(name));
      };

      if (xAxisValues && legendValues) {
        processNodeData(widgetTitle, xAxisValues, legendValues);
      }

      const processChildren = (nodes: any[]) => {
        nodes.forEach((node) => {
          if (node.xAxisValues && node.legendValues) {
            processNodeData(
              node.name || node.taskName,
              node.xAxisValues,
              node.legendValues,
            );
          }

          if (node.children && node.children.length > 0) {
            processChildren(node.children);
          }
        });
      };

      if (childTiers && childTiers.length > 0) {
        processChildren(childTiers);
      }

      XLSX.writeFile(wb, `${widgetTitle}.xlsx`);
      toast.success("Excel downloaded successfully");
    } catch (error) {
      console.error("Excel download failed", error);
      toast.error("Failed to download Excel");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAddTierClick = () => {
    setShowAddTierModal(true);
  };

  const handleChartClick = () => {
    if (childTiers?.length > 0) {
      setShowChildrenModal(true);
    }
  };

  return (
    <>
      <ChartCardWrapper
        title={widgetTitle}
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
          <div className="flex gap-6 mt-3">
            {legendValues.map((l) =>
              l.label ? (
                <div key={l.field} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: l.color }}
                  />
                  <span className="text-sm">
                    {l.label} ({l.type || "bar"})
                  </span>
                </div>
              ) : null,
            )}
          </div>
        }
        footer={
          childTiers?.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium text-center">
              Click chart to view {childTiers?.length} child tier
              {childTiers?.length > 1 ? "s" : ""}
            </p>
          ) : undefined
        }
      >
        <div style={{ height: "400px", width: "100%" }}>
          <Chart ref={chartRef} type="bar" data={data} options={options} />
        </div>
      </ChartCardWrapper>

      <AddTierModal
        isOpen={showAddTierModal}
        onClose={() => setShowAddTierModal(false)}
        parentChartName={widgetTitle}
      />

      {showChildrenModal && (
        <TierChartModal
          isOpen={showChildrenModal}
          onClose={() => setShowChildrenModal(false)}
          tierLevel={tierLevel + 1}
          title={widgetTitle}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {childTiers &&
              childTiers?.map((tier: any) => (
                <ComboChart
                  newData={tier?.children || []}
                  key={tier?.id}
                  widgetTitle={tier?.name || tier?.taskName}
                  xAxisValues={tier?.xAxisValues}
                  legendValues={tier?.legendValues}
                  numOfLegendDataSet={tier?.legendValues?.length}
                  startingRange={startingRange}
                  endingRange={endingRange}
                  tierLevel={tierLevel + 1}
                  chartId={tier?.id}
                  allUploadedData={allUploadedData}
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
