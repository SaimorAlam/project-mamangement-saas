/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect, useRef } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { Copy, Trash2, Download } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWidgets } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

/*       TYPES       */

type DataPoint = {
  label: string;
  y: number;
};

export type TierChart = {
  id: string;
  name: string;
  xAxisValues: string[];
  children: TierChart[];
};

type Props = {
  widgetTitle?: string;
  xAxisValues?: string[];
  startingRange: number;
  endingRange: number;
  onToggleWidget?: () => void;
  tierLevel?: number;
  chartId?: string;
};

/*       COMPONENT       */

export default function ParetoChart({
  widgetTitle = "Customer Complaints",
  xAxisValues = [],
  startingRange,
  endingRange,
  onToggleWidget,
  tierLevel = 0,
  chartId = "root",
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const chartRef = useRef<any>(null);

  // Tier management states
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [childTiers, setChildTiers] = useState<TierChart[]>([]);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  const [getChartTitleId] = useGetChartTitleIdMutation();

  /*   DATA GENERATION   */
  const dataPoints: DataPoint[] = useMemo(() => {
    if (!xAxisValues.length) return [];

    const range = endingRange - startingRange;
    const step = range / xAxisValues.length;

    // Generate descending values for Pareto effect
    return xAxisValues
      .filter(Boolean)
      .map((label, index) => ({
        label,
        y: Math.round(endingRange - step * index),
      }))
      .sort((a, b) => b.y - a.y); // Sort descending
  }, [xAxisValues, startingRange, endingRange]);

  /*   TOTAL VALUE   */
  const totalValue = useMemo(() => {
    return dataPoints.reduce((sum, dp) => sum + dp.y, 0);
  }, [dataPoints]);

  /*   CREATE PARETO LINE   */
  const createParetoLine = (chart: any) => {
    if (!chart || !chart.data || !chart.data[0]) return;

    const dps: any[] = [];
    let yTotal = 0;
    let yPercent = 0;

    // Calculate total
    for (let i = 0; i < chart.data[0].dataPoints.length; i++) {
      yTotal += chart.data[0].dataPoints[i].y;
    }

    // Calculate cumulative percentage
    for (let i = 0; i < chart.data[0].dataPoints.length; i++) {
      const yValue = chart.data[0].dataPoints[i].y;
      yPercent += (yValue / yTotal) * 100;
      dps.push({
        label: chart.data[0].dataPoints[i].label,
        y: yPercent,
      });
    }

    // Add line series
    chart.addTo("data", {
      type: "line",
      yValueFormatString: "0.##'%'",
      dataPoints: dps,
    });

    // Configure secondary axis
    chart.data[1].set("axisYType", "secondary", false);
    chart.axisY[0].set("maximum", Math.round(yTotal / 20) * 20);
    chart.axisY2[0].set("maximum", 100);
  };

  /*   CHART OPTIONS   */
  const chartOptions = useMemo(
    () => ({
      title: {
        text: widgetTitle,
        fontSize: 20,
        fontWeight: "normal",
      },
      axisX: {
        title: "Categories",
        labelAngle: -45,
      },
      axisY: {
        title: "Count",
        lineColor: "#4F81BC",
        tickColor: "#4F81BC",
        labelFontColor: "#4F81BC",
      },
      axisY2: {
        title: "Cumulative %",
        suffix: "%",
        lineColor: "#C0504E",
        tickColor: "#C0504E",
        labelFontColor: "#C0504E",
      },
      data: [
        {
          type: "column",
          color: "#4F81BC",
          dataPoints: dataPoints,
        },
      ],
    }),
    [widgetTitle, dataPoints]
  );

  /*   EFFECT TO CREATE PARETO   */
  useEffect(() => {
    if (chartRef.current && dataPoints.length > 0) {
      createParetoLine(chartRef.current);
    }
  }, [dataPoints]);

  /*   ACTIONS   */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(dataPoints, null, 2));
  };

  const handleDownload = () => {
    const payload = {
      numberOfDataset: 1,
      firstFiledDataset: startingRange,
      lastFiledDAtaset: endingRange,
      showWidgets: [{ legend_name: "Pareto", color: "#4F81BC" }],
      title: widgetTitle,
      status: "ACTIVE",
      category: "PARETO",
      xAxis: JSON.stringify({
        labels: xAxisValues,
        values: dataPoints.map((dp) => dp.y),
      }),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({}),
    };
    setIsDownloading(true);

    DownloadAndSaveCSVforModuleOneWidget(
      payload,
      getChartTitleId,
      widgetTitle,
      xAxisValues,
      [{ label: "Pareto", field: "pareto", color: "#4F81BC" }]
    );

    setIsDownloading(false);
  };

  const handleWidgetClick = () => {
    if (onToggleWidget) {
      onToggleWidget();
    }
    setShowPopover(false);
  };

  const handleAddTierClick = () => {
    setShowAddTierModal(true);
    setShowPopover(false);
  };

  const handleSaveTier = (tierName: string) => {
    const newTier: TierChart = {
      id: `${chartId}-tier-${Date.now()}`,
      name: tierName,
      xAxisValues: xAxisValues,
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
      <div
        className={`w-full bg-white border border-gray-200 rounded-lg p-6 ${
          childTiers.length > 0
            ? "cursor-pointer hover:shadow-lg transition-shadow"
            : ""
        }`}
        onClick={handleChartClick}
      >
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">{widgetTitle}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {dataPoints.length} categories
            </p>
          </div>

          <div
            className="flex items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-gray-500">Total: {totalValue}</p>

            <div className="flex gap-2 border-l pl-4 relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPopover(!showPopover);
                }}
                className="p-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                <BsThreeDots size={18} />
              </button>

              {showPopover && (
                <div className="absolute right-0 top-12 bg-white border border-gray-300 rounded-lg shadow-lg p-2 w-48 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy();
                      setShowPopover(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                  >
                    <Copy size={18} />
                    <span>Copy</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload();
                      setShowPopover(false);
                    }}
                    disabled={isDownloading}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                  >
                    <Download size={18} />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPopover(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left text-red-600"
                  >
                    <Trash2 size={18} />
                    <span>Delete</span>
                  </button>

                  {onToggleWidget && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWidgetClick();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                    >
                      <MdOutlineWidgets size={18} />
                      <span>Widget</span>
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddTierClick();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                  >
                    <GoPlus size={18} />
                    <span>Add Tier</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {dataPoints.length > 0 ? (
          <div style={{ height: "400px", width: "100%" }}>
            <CanvasJSChart
              options={chartOptions}
              onRef={(ref: any) => (chartRef.current = ref)}
            />
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-400">
            No data available. Please add categories in the widget
            configuration.
          </div>
        )}

        {/* Indicator if chart has children */}
        {childTiers.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-blue-600 font-medium">
              Click chart to view {childTiers.length} child tier
              {childTiers.length > 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

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
              <ParetoChart
                key={tier.id}
                widgetTitle={tier.name}
                xAxisValues={tier.xAxisValues}
                startingRange={startingRange}
                endingRange={endingRange}
                tierLevel={tierLevel + 1}
                chartId={tier.id}
              />
            ))}
          </div>
        </TierChartModal>
      )}
    </>
  );
}