/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  setChildPayload,
  setGroupTitle,
} from "@/store/Slices/ChartSlice/ChartSlice";
import AddTierModal from "../../../Modal/AddTierModal";
import TierChartModal from "../../../Modal/TierChartModal";
import ChartCardWrapper from "./ChartCardWrapper";

// Common Imports
import {
  BaseChartProps,
  ChartData,
  LegendValue,
  ChartType,
} from "./chartTypes";
import {
  getEffectiveLegendValues,
  getEffectiveXAxisValues,
  getSafeRanges,
  resolveChartData,
} from "./chartUtils";
import { useChartTierState } from "./useChartTierState";
import { downloadChartDataAsExcel, ChartExcelType } from "./excelUtils";
import { ChartLegendHeader, ChartChildTierFooter } from "./ChartSharedUI";

interface BaseChartContainerProps extends BaseChartProps {
  category: ChartType;
  excelType: ChartExcelType;
  children: (data: {
    chartData: ChartData[];
    isSampleData: boolean;
    safeStartingRange: number;
    safeEndingRange: number;
    effectiveLegendValues: LegendValue[];
    effectiveXAxisValues: string[];
  }) => ReactNode;
  generatorFunc: (
    xAxis: string[],
    legends: LegendValue[],
    numOfLegendDataSet: number,
    start: number,
    end: number,
  ) => ChartData[];
  getTierLegends: (tier: any) => LegendValue[];
  parseTierData: (
    xAxis: any,
    legends: LegendValue[],
    title: string,
  ) => { labels: string[]; data: any };
  renderChildChart: (tier: any, props: any) => ReactNode;
}

export default function BaseChartContainer({
  widgetTitle = "Chart",
  xAxisValues = [],
  legendValues = [],
  numOfLegendDataSet = 1,
  startingRange,
  endingRange,
  onToggleWidget,
  onDelete,
  tierLevel = 0,
  chartId = "root",
  projectId,
  isCreationMode = false,
  allUploadedData,
  isPreview = false,
  breadcrumbPath = [],
  onNavigate,
  category,
  excelType,
  children,
  generatorFunc,
  getTierLegends,
  parseTierData,
  renderChildChart,
}: BaseChartContainerProps) {
  const dispatch = useAppDispatch();
  const groupTitle = useAppSelector((state) => state.chartSlice.groupTitle);

  const {
    showAddTierModal,
    setShowAddTierModal,
    showChildrenModal,
    setShowChildrenModal,
    isDownloading,
    setIsDownloading,
    childTiers,
    isLoading,
    currentBreadcrumbs,
    handleChildNavigate,
    handleBreadcrumbClick,
    getAllTheLeafChart,
  } = useChartTierState(
    chartId,
    widgetTitle,
    tierLevel,
    breadcrumbPath,
    onNavigate,
  );

  /* ---------- DATA NORMALIZATION ---------- */

  const effectiveLegendValues = useMemo(
    () => getEffectiveLegendValues(legendValues),
    [legendValues],
  );

  const effectiveXAxisValues = useMemo(
    () => getEffectiveXAxisValues(xAxisValues),
    [xAxisValues],
  );

  const { safeStartingRange, safeEndingRange } = useMemo(
    () => getSafeRanges(startingRange ?? 0, endingRange ?? 100),
    [startingRange, endingRange],
  );

  const { chartData, isSampleData } = useMemo(() => {
    return resolveChartData(
      allUploadedData,
      xAxisValues,
      effectiveXAxisValues,
      effectiveLegendValues,
      safeStartingRange,
      safeEndingRange,
      numOfLegendDataSet,
      widgetTitle,
      generatorFunc,
    );
  }, [
    allUploadedData,
    xAxisValues,
    effectiveXAxisValues,
    effectiveLegendValues,
    safeStartingRange,
    safeEndingRange,
    numOfLegendDataSet,
    widgetTitle,
    generatorFunc,
  ]);

  /* ---------- ACTIONS ---------- */

  const handleDownload = () => {
    if (projectId) {
      downloadChartDataAsExcel(
        widgetTitle,
        projectId,
        getAllTheLeafChart,
        widgetTitle,
        effectiveXAxisValues,
        effectiveLegendValues,
        numOfLegendDataSet,
        setIsDownloading,
        excelType,
        chartId,
      );
    }
  };

  const handleAddTierClick = (title: string) => {
    if (tierLevel === 0) {
      dispatch(setGroupTitle(title));
    }
    const childPayload = {
      numberOfDataset: numOfLegendDataSet,
      firstFieldDataset: safeStartingRange,
      lastFieldDataset: safeEndingRange,
      widgets: effectiveLegendValues.map((l) => ({
        legendName: l.label,
        color: l.color,
      })),
      title: "",
      status: "ACTIVE",
      category: category,
      xAxis: JSON.stringify([
        ["Label", ...effectiveLegendValues.map((l) => l.label)],
        ...effectiveXAxisValues.map((label) => [
          label,
          ...Array(numOfLegendDataSet).fill(0),
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
    if (childTiers && childTiers.length > 0) {
      setShowChildrenModal(true);
      if (tierLevel === 0) {
        dispatch(setGroupTitle(widgetTitle));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200 animate-pulse">
        <span className="text-gray-400 text-sm">Loading Chart...</span>
      </div>
    );
  }

  return (
    <>
      <ChartCardWrapper
        title={widgetTitle}
        subtitle={`${isSampleData ? "(Sample Data) " : ""}Assessment View`}
        tierLevel={tierLevel}
        onHeaderClick={handleChartClick}
        menuActions={{
          onDownload:
            !isCreationMode && tierLevel === 0 ? handleDownload : undefined,
          onDelete: onDelete,
          onAddTier: !isCreationMode
            ? () => handleAddTierClick(widgetTitle)
            : undefined,
          onToggleWidget: onToggleWidget,
        }}
        isDownloading={isDownloading}
        isPreview={isPreview}
        customHeaderContent={
          <ChartLegendHeader effectiveLegendValues={effectiveLegendValues} />
        }
        footer={<ChartChildTierFooter childTiers={childTiers} />}
        chartId={chartId}
      >
        {children({
          chartData,
          isSampleData,
          safeStartingRange,
          safeEndingRange,
          effectiveLegendValues,
          effectiveXAxisValues,
        })}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            {childTiers?.map((tier: any) => {
              const legends = getTierLegends(tier);
              const { labels, data: tierData } = parseTierData(
                tier.xAxis,
                legends,
                tier.title || tier.name,
              );

              return renderChildChart(tier, {
                key: tier.id,
                widgetTitle: tier.title || tier.name || "Untitled Tier",
                xAxisValues: labels,
                legendValues: legends,
                numOfLegendDataSet: legends.length,
                startingRange: safeStartingRange,
                endingRange: safeEndingRange,
                tierLevel: tierLevel + 1,
                chartId: tier.id,
                projectId: tier.projectId || projectId,
                allUploadedData: tierData as any,
                isPreview: isPreview,
                breadcrumbPath: currentBreadcrumbs,
                onNavigate: handleChildNavigate,
                onDelete: onDelete,
              });
            })}
          </div>
        </TierChartModal>
      )}
    </>
  );
}
