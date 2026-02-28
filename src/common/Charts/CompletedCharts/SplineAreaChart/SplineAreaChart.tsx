/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import * as XLSX from "xlsx";
import { toast } from "sonner";

import { downloadCSVForModuleOne } from "@/utils/DownlaodChartCSV";
import { generateAreaChartData } from "@/utils";
import ChartCardWrapper from "../../components/ChartCardWrapper";
import AddTierModal from "@/common/Modal/AddTierModal";
import TierChartModal from "@/common/Modal/TierChartModal";
import { useLazyFindChildrenValueQuery, useLazyGetAllTheLeafChartQuery } from "@/store/Api/ChartApi/ChartApi";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setChildPayload, setGroupTitle } from "@/store/Slices/ChartSlice/ChartSlice";
import { parseXAxisData } from "../StackedBarChart/StackedBarChart";

/* ---------- TYPES ---------- */

type LegendValue = {
  label: string;
  field: string;
  color: string;
};

type Props = {
  widgetTitle?: string;
  xAxisValues?: string[];
  startingRange: number;
  endingRange: number;
  onToggleWidget?: () => void;
  tierLevel?: number;
  chartId?: string;
  onDelete?: () => void;
  legendValues?: LegendValue[];
  isPreview?: boolean;
  isCreationMode?: boolean;
  allUploadedData?: { [key: string]: any[] };
  projectId?: string;
};

/* ---------- COMPONENT ---------- */

export default function SplineAreaChart({
  widgetTitle = "Performance Trend",
  xAxisValues = [],
  startingRange,
  endingRange,
  onToggleWidget,
  tierLevel = 0,
  legendValues = [],
  chartId = "root",
  onDelete,
  isPreview = false,
  isCreationMode = false,
  allUploadedData,
  projectId,
}: Props) {
  const [getAllTheLeafChart] = useLazyGetAllTheLeafChartQuery();
  const [findChildrenValue, { data: childrenResponse }] =
    useLazyFindChildrenValueQuery();

  const dispatch = useAppDispatch();
  const groupTitle = useAppSelector((state) => state.chartSlice.groupTitle);

  useEffect(() => {
    if (chartId && chartId !== "root") {
      findChildrenValue(chartId);
    }
  }, [chartId, findChildrenValue]);

  const [isDownloading, setIsDownloading] = useState(false);
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  const childTiers = childrenResponse?.data || [];

  /* ---------- DATA ---------- */

  const effectiveLegendValues = useMemo(() => {
    if (legendValues.length > 0 && legendValues.some((l) => l.label !== "")) {
      return legendValues.map((l) => ({
        ...l,
        field: l.field || l.label.toLowerCase().replace(/\s+/g, ""),
      }));
    }
    return [
      { label: "Sample A", field: "field1", color: "#3b82f6" },
      { label: "Sample B", field: "field2", color: "#f97316" },
      { label: "Sample C", field: "field3", color: "#ec4899" },
    ];
  }, [legendValues]);

  const effectiveXAxisValues = useMemo(() => {
    const validValues = xAxisValues.filter((v) => v !== "");
    if (validValues.length > 0) return validValues;
    return ["Jan", "Feb", "Mar", "Apr", "May"];
  }, [xAxisValues]);

  const { safeStartingRange, safeEndingRange } = useMemo(() => {
    let start = Number(startingRange);
    let end = Number(endingRange);
    if (isNaN(start) || isNaN(end) || start === end || (start === 0 && end === 0)) {
      start = 0;
      end = 100;
    }
    return { safeStartingRange: start, safeEndingRange: end };
  }, [startingRange, endingRange]);

  const { chartData, isSampleData } = useMemo(() => {
    const sheetName = (widgetTitle || "Sheet")
      .replace(/[:/?*[\]\\]/g, " ")
      .trim()
      .substring(0, 31);

    const dataToUse = allUploadedData?.[sheetName];

    // Priority 1: Real Uploaded Data
    const hasRealData =
      dataToUse &&
      dataToUse.length > 0 &&
      dataToUse.some((row) =>
        effectiveLegendValues.some((l) => Number(row[l.field] || 0) > 0),
      );

    if (hasRealData) {
      // Convert flat recharts-style data to apexcharts series format
      const formattedSeries = effectiveLegendValues.map((l) => ({
        name: l.label,
        data: dataToUse.map((row) => Number(row[l.field] || 0)),
      }));
      return { chartData: formattedSeries, isSampleData: false };
    }

    const hasConfig =
      xAxisValues.length > 0 &&
      xAxisValues.some((v) => v !== "") &&
      legendValues.length > 0 &&
      legendValues.some((l) => l.label !== "");

    // Priority 2: Sample Data based on Config
    if (hasConfig) {
      const generatedRaw = generateAreaChartData(
        xAxisValues.filter((v) => v !== ""),
        effectiveLegendValues as any,
        safeStartingRange,
        safeEndingRange,
      );
      const formattedSeries = effectiveLegendValues.map((l) => ({
        name: l.label,
        data: generatedRaw.map((row: any) => Number(row[l.field] || 0)),
      }));
      return { chartData: formattedSeries, isSampleData: true };
    }

    // Priority 3: Fallback Sample Data
    const generatedRaw = generateAreaChartData(
      effectiveXAxisValues,
      effectiveLegendValues as any,
      0,
      100,
    );
    const formattedSeries = effectiveLegendValues.map((l) => ({
      name: l.label,
      data: generatedRaw.map((row: any) => Number(row[l.field] || 0)),
    }));
    return { chartData: formattedSeries, isSampleData: true };
  }, [
    widgetTitle,
    allUploadedData,
    effectiveLegendValues,
    xAxisValues,
    legendValues,
    safeStartingRange,
    safeEndingRange,
    effectiveXAxisValues,
  ]);

  /* ---------- CHART CONFIG ---------- */

  const chartOptions: any = useMemo(
    () => ({
      chart: {
        type: "area",
        height: 350,
        toolbar: { show: false },
        dropShadow: {
          enabled: true,
          top: 3,
          left: 2,
          blur: 4,
          opacity: 0.15,
        },
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.6,
          opacityFrom: 0.6,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: effectiveLegendValues.map((l) => l.color),
      xaxis: {
        categories: isSampleData ? effectiveXAxisValues : xAxisValues,
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (val: number) => Math.round(val).toString(),
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "right",
      },
    }),
    [
      xAxisValues,
      isSampleData,
      effectiveXAxisValues,
      effectiveLegendValues,
    ],
  );

  const series = chartData;

  /* ---------- ACTIONS ---------- */

  const handleCopy = () => {
    const dataToCopy = series[0]?.data || [];
    const copyData = xAxisValues.map((label, index) => ({
      label,
      value: dataToCopy[index],
    }));
    navigator.clipboard.writeText(JSON.stringify(copyData, null, 2));
  };

  const handleDownload = async (title: string) => {
    if (!projectId) {
      // Fallback to simple CSV template if no projectId
      setIsDownloading(true);
      downloadCSVForModuleOne(
        widgetTitle,
        xAxisValues,
        effectiveLegendValues,
      );
      setIsDownloading(false);
      return;
    }

    setIsDownloading(true);
    try {
      const res = await getAllTheLeafChart(projectId).unwrap();
      const leafCharts =
        res?.data?.find((item: any) => item.grouptitle === title) || [];

      if (!leafCharts.charts || leafCharts.charts.length === 0) {
        // Just download current chart template if no group
        const wb = XLSX.utils.book_new();
        const headers = ["Label", ...effectiveLegendValues.map((l) => l.label)];
        const rows = effectiveXAxisValues.map((label) => [
          label,
          ...Array(effectiveLegendValues.length).fill(" "),
        ]);
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        XLSX.utils.book_append_sheet(wb, ws, widgetTitle.substring(0, 31));
        XLSX.writeFile(wb, `${widgetTitle}_template.xlsx`);
        toast.success("Excel template downloaded");
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
        let xAxisItems: string[] = [];
        try {
          const parsed =
            typeof node.xAxis === "string"
              ? JSON.parse(node.xAxis)
              : node.xAxis;
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (Array.isArray(parsed[0])) {
              const hasHeader =
                parsed[0].length > 1 && typeof parsed[0][1] === "string";
              xAxisItems = (hasHeader ? parsed.slice(1) : parsed).map(
                (row: any) => String(row[0]),
              );
            } else {
              xAxisItems = parsed.map((v) => String(v));
            }
          } else if (parsed?.labels) {
            xAxisItems = parsed.labels;
          }
        } catch {
          /* ignore */
        }

        if (!xAxisItems.length) xAxisItems = effectiveXAxisValues;

        let legends = node.legendValues || [];
        const nodeWidgets = node.widgets || node.splineChart?.widgets || [];
        if (!legends.length && nodeWidgets.length > 0) {
          legends = nodeWidgets.map((w: any) => ({
            label: w.legendName || w.label || "Legend",
          }));
        }
        if (!legends.length) legends = effectiveLegendValues;

        const headers = ["Label", ...legends.map((l: any) => l.label)];
        const rows = xAxisItems.map((label: string) => [
          label,
          ...Array(legends.length).fill(" "),
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
      toast.success("Excel template downloaded successfully");
    } catch (error) {
      console.error("Excel download failed", error);
      toast.error("Failed to download template");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAddTierClick = (title: string) => {
    if (tierLevel === 0) {
      dispatch(setGroupTitle(title));
    }
    const childPayload = {
      numberOfDataset: legendValues.length || 3,
      firstFieldDataset: safeStartingRange,
      lastFieldDataset: safeEndingRange,
      widgets: effectiveLegendValues.map((l) => ({
        legendName: l.label,
        color: l.color,
      })),
      title: "",
      status: "ACTIVE",
      category: "SPLINE",
      xAxis: JSON.stringify([
        ["Label", ...effectiveLegendValues.map((l) => l.label)],
        ...effectiveXAxisValues.map((label) => [
          label,
          ...Array(effectiveLegendValues.length).fill(0),
        ]),
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
    if (childTiers.length > 0) {
      setShowChildrenModal(true);
      if (tierLevel === 0) {
        dispatch(setGroupTitle(widgetTitle));
      }
    }
  };

  /* ---------- RENDER ---------- */

  return (
    <>
      <ChartCardWrapper
        title={widgetTitle}
        subtitle={`Viewing trend ${isSampleData ? "(Sample Data)" : ""}`}
        // chartId={chartId}
        tierLevel={tierLevel}
        onHeaderClick={handleChartClick}
        menuActions={{
          onCopy: handleCopy,
          onDownload:
            tierLevel === 0 ? () => handleDownload(widgetTitle) : undefined,
          onDelete: onDelete,
          onAddTier: !isCreationMode
            ? () => handleAddTierClick(widgetTitle)
            : undefined,
          onToggleWidget: onToggleWidget,
        }}
        isDownloading={isDownloading}
        isPreview={isPreview}
        footer={
          childTiers.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium text-center">
              Click chart to view {childTiers.length} tier
              {childTiers.length > 1 ? "s" : ""}
            </p>
          ) : undefined
        }
      >
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="area"
          height={350}
        />
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
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {childTiers?.map((tier: any) => {
              const legends = (tier.widgets || []).map((w: any) => ({
                label: w.legendName || w.label,
                field: (w.legendName || w.label)
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
                color: w.color,
              }));

              const { labels, data: tierData } = parseXAxisData(
                tier.xAxis,
                legends,
                tier.title,
              );

              return (
                <SplineAreaChart
                  key={tier.id}
                  widgetTitle={tier.title || tier.name}
                  xAxisValues={labels}
                  legendValues={legends}
                  startingRange={safeStartingRange}
                  endingRange={safeEndingRange}
                  chartId={tier.id}
                  projectId={tier.projectId || projectId}
                  allUploadedData={tierData}
                  onDelete={onDelete}
                  tierLevel={tierLevel + 1}
                />
              );
            })}
          </div>
        </TierChartModal>
      )}
    </>
  );
}
