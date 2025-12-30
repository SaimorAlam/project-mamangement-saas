/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Copy, Trash2, Download } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWidgets } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";

/*     TYPES     */
type RangeData = {
  x: string;
  y: [number, number];
};

type LegendValue = {
  label: string;
  field: string;
  color: string;
};

export type TierChart = {
  id: string;
  name: string;
  xAxisValues: string[];
  legendValues: LegendValue[];
  children: TierChart[];
};

type Props = {
  widgetTitle?: string;          // Title for root or tier name for children
  xAxisValues?: string[];
  legendValues?: LegendValue[];
  numOfLegendDataSet?: number;
  startingRange: number;
  endingRange: number;
  onToggleWidget?: () => void;
  tierLevel?: number;
  chartId?: string;
};

export default function WaterfallChart({
  widgetTitle = "Waterfall Chart",
  xAxisValues = [],
  legendValues = [],
  numOfLegendDataSet = 1,
  startingRange,
  endingRange,
  onToggleWidget,
  tierLevel = 0,
  chartId = "root",
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [childTiers, setChildTiers] = useState<TierChart[]>([]);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  const [getChartTitleId] = useGetChartTitleIdMutation();

  /*   DATA GENERATION   */
  const generateRangeData = (xValues: string[], seed: number): RangeData[] => {
    const range = endingRange - startingRange;
    const rangeWidth = Math.floor(range / 4);

    return xValues.filter(Boolean).map((x, index) => {
      const baseValue = startingRange + ((seed * 17 + index * 23) % range);
      const lowerBound = Math.max(startingRange, baseValue - rangeWidth / 2);
      const upperBound = Math.min(endingRange, baseValue + rangeWidth / 2);

      return {
        x,
        y: [Math.round(lowerBound), Math.round(upperBound)] as [number, number],
      };
    });
  };

  const series = useMemo(() => {
    if (!xAxisValues.length || !legendValues.length) return [];

    return legendValues.filter((l) => l.label).map((legend, index) => ({
      name: legend.label,
      data: generateRangeData(xAxisValues, index * 37),
    }));
  }, [xAxisValues, legendValues, startingRange, endingRange]);

  /*   CHART OPTIONS   */
  const chartOptions: any = useMemo(
    () => ({
      chart: {
        type: "rangeBar",
        height: 350,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return val[0] + " - " + val[1];
        },
      },
      colors: legendValues.map((l) => l.color),
      xaxis: {
        categories: xAxisValues.filter(Boolean),
        title: { text: "Categories" },
      },
      yaxis: {
        title: { text: "Range" },
        min: startingRange,
        max: endingRange,
      },
      legend: { position: "top", horizontalAlign: "left" },
    }),
    [xAxisValues, legendValues, startingRange, endingRange]
  );

  const totalRanges = useMemo(() => {
    return series.reduce((sum, s) => sum + s.data.length, 0);
  }, [series]);

  /*   ACTIONS   */
  const handleCopy = () => {
    const copyData = series.map((s) => ({ name: s.name, data: s.data }));
    navigator.clipboard.writeText(JSON.stringify(copyData, null, 2));
  };

  const handleDownload = async () => {
    const payload = {
      numberOfDataset: numOfLegendDataSet,
      firstFiledDataset: startingRange,
      lastFiledDAtaset: endingRange,
      showWidgets: legendValues.map((l) => ({
        legend_name: l.label,
        color: l.color,
      })),
      title: widgetTitle,
      status: "ACTIVE",
      category: "BAR",
      xAxis: JSON.stringify({ labels: xAxisValues, values: [] }),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({}),
    };

    setIsDownloading(true);
    await DownloadAndSaveCSVforModuleOneWidget(
      payload,
      getChartTitleId,
      widgetTitle,
      xAxisValues,
      legendValues
    );
    setIsDownloading(false);
  };

  const handleWidgetClick = () => {
    onToggleWidget?.();
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
  const isRoot = chartId === "root" || tierLevel === 0;

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
        {/* HEADER - Show only for root chart OR show tier name for children */}
        {(isRoot || tierLevel > 0) && (
          <div className="flex justify-between mb-6">
            <div>
              {/* Title: Root title or Tier name */}
              <h2 className="text-xl font-semibold">
                {isRoot ? widgetTitle : widgetTitle} {/* tier name comes from parent */}
              </h2>

              {/* Legend row - only show on root */}
              {/* {isRoot && (
                <div className="flex gap-6 mt-3">
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
                      )
                  )}
                </div>
              )} */}
            </div>

            {/* ACTION MENU - only show on root */}
            {isRoot && (
              <div
                className="flex items-center gap-4"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-sm text-gray-500">
                  Total Ranges: {totalRanges}
                </p>

                <div className="relative border-l pl-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPopover(!showPopover);
                    }}
                    className="p-2 border rounded hover:bg-gray-50"
                  >
                    <BsThreeDots size={18} />
                  </button>

                  {showPopover && (
                    <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg p-2 w-48 z-10">
                      {/* ... all your menu items unchanged ... */}
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
            )}
          </div>
        )}

        {/* CHART */}
        {series.length > 0 && xAxisValues.filter(Boolean).length > 0 ? (
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="rangeBar"
            height={350}
          />
        ) : (
          <div className="h-[350px] flex items-center justify-center text-gray-400">
            No data available.
          </div>
        )}

        {/* Child tier indicator - only on root */}
        {isRoot && childTiers.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-blue-600 font-medium">
              Click chart to view {childTiers.length} child tier
              {childTiers.length > 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {/* MODALS */}
      {isRoot && (
        <>
          <AddTierModal
            isOpen={showAddTierModal}
            onClose={() => setShowAddTierModal(false)}
            onSave={handleSaveTier}
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
                {childTiers.map((tier) => (
                  <WaterfallChart
                    key={tier.id}
                    widgetTitle={tier.name}               
                    xAxisValues={tier.xAxisValues}
                    legendValues={tier.legendValues}
                    numOfLegendDataSet={tier.legendValues.length}
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
      )}
    </>
  );
}