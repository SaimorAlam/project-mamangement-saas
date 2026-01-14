/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Copy, Trash2, Download, CloudCog } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWidgets } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleTwoWidget } from "@/utils/Download&SaveCSV";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";

/* ---------- TYPES ---------- */

export type TierChart = {
    id: string;
    name: string;
    xAxisValues: string[];
    children: TierChart[];
};
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
};

/* ---------- COMPONENT ---------- */

export default function SplineAreaChart({
    widgetTitle = "Performance Trend",
    xAxisValues = [],
    startingRange,
    endingRange,
    onToggleWidget,
    tierLevel = 0,
    onDelete,
    legendValues,
    chartId = "root",
}: Props) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [showPopover, setShowPopover] = useState(false);
    const [showAddTierModal, setShowAddTierModal] = useState(false);
    const [childTiers, setChildTiers] = useState<TierChart[]>([]);
    const [showChildrenModal, setShowChildrenModal] = useState(false);
    const [getChartTitleId] = useGetChartTitleIdMutation();
    console.log("legendValues", legendValues);
    /* ---------- DATA ---------- */

    const chartData = useMemo(() => {
        if (!xAxisValues.length) return [];

        const step =
            (endingRange - startingRange) / (xAxisValues.length - 1 || 1);

        return xAxisValues.map((_, index) =>
            Math.round(startingRange + step * index)
        );
    }, [xAxisValues, startingRange, endingRange]);

    const totalValue = useMemo(
        () => chartData.reduce((sum, val) => sum + val, 0),
        [chartData]
    );

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

            colors: ["#00E396"],

            xaxis: {
                categories: xAxisValues.filter(Boolean),
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
                show: false,
            },
        }),
        [xAxisValues]
    );

    const series = useMemo(
        () => [
            {
                name: "Trend",
                data: chartData,
            },
        ],
        [chartData]
    );

    /* ---------- ACTIONS ---------- */

    const handleCopy = () => {
        const copyData = xAxisValues.map((label, index) => ({
            label,
            value: chartData[index],
        }));
        navigator.clipboard.writeText(JSON.stringify(copyData, null, 2));
        setShowPopover(false);
    };

    const handleDownload = () => {
        const payload = {
            numberOfDataset: xAxisValues.length,
            firstFiledDataset: 0,
            lastFiledDAtaset: 100,
            showWidgets: xAxisValues.map((l) => ({ legend_name: l })),
            title: widgetTitle,
            status: "ACTIVE",
            category: "AREA",
            xAxis: JSON.stringify({ labels: [], values: [] }),
            yAxis: JSON.stringify({}),
            zAxis: JSON.stringify({}),
        };

        setIsDownloading(true);

        DownloadAndSaveCSVforModuleTwoWidget(
            payload,
            getChartTitleId,
            widgetTitle,
            xAxisValues
        );

        setIsDownloading(false);
    };

    const handleAddTier = (tierName: string) => {
        setChildTiers((prev) => [
            ...prev,
            {
                id: `${chartId}-tier-${Date.now()}`,
                name: tierName,
                xAxisValues,
                children: [],
            },
        ]);
        setShowAddTierModal(false);
    };

    const handleChartClick = () => {
        if (childTiers.length > 0) {
            setShowChildrenModal(true);
        }
    };

    /* ---------- RENDER ---------- */

    return (
        <>
            <div
                className={`w-full bg-white border border-gray-200 rounded-lg p-6 ${childTiers.length
                    ? "cursor-pointer hover:shadow-lg transition-shadow"
                    : ""
                    }`}
                onClick={handleChartClick}
            >
                <div className="flex justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">{widgetTitle}</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {xAxisValues.length} points
                        </p>
                    </div>

                    <div
                        className="flex items-center gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* <p className="text-sm text-gray-500">Total {totalValue}</p> */}

                        <div className="relative border-l pl-4">
                            <button
                                className="p-2 border rounded hover:bg-gray-50"
                                onClick={() => setShowPopover(!showPopover)}
                            >
                                <BsThreeDots size={18} />
                            </button>

                            {showPopover && (
                                <div className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-lg p-2 z-10">
                                    <button
                                        onClick={handleCopy}
                                        className="w-full flex gap-3 px-3 py-2 hover:bg-gray-50 rounded"
                                    >
                                        <Copy size={18} /> Copy
                                    </button>

                                    <button
                                        onClick={handleDownload}
                                        disabled={isDownloading}
                                        className="w-full flex gap-3 px-3 py-2 hover:bg-gray-50 rounded"
                                    >
                                        <Download size={18} /> Download
                                    </button>

                                    <button className="w-full flex gap-3 px-3 py-2 hover:bg-gray-50 rounded text-red-600">
                                        <Trash2 size={18} /> Delete
                                    </button>

                                    {onToggleWidget && (
                                        <button
                                            onClick={() => {
                                                onToggleWidget();
                                                setShowPopover(false);
                                            }}
                                            className="w-full flex gap-3 px-3 py-2 hover:bg-gray-50 rounded"
                                        >
                                            <MdOutlineWidgets size={18} /> Widget
                                        </button>
                                    )}

                                    <button
                                        onClick={() => {
                                            setShowAddTierModal(true);
                                            setShowPopover(false);
                                        }}
                                        className="w-full flex gap-3 px-3 py-2 hover:bg-gray-50 rounded"
                                    >
                                        <GoPlus size={18} /> Add Tier
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {xAxisValues.length ? (
                    <ReactApexChart
                        options={chartOptions}
                        series={series}
                        type="area"
                        height={350}
                    />
                ) : (
                    <div className="h-[350px] flex items-center justify-center text-gray-400">
                        No data available
                    </div>
                )}

                {childTiers.length > 0 && (
                    <p className="mt-4 text-center text-sm text-blue-600 font-medium">
                        Click chart to view {childTiers.length} tier
                        {childTiers.length > 1 ? "s" : ""}
                    </p>
                )}
            </div>

            <AddTierModal
                isOpen={showAddTierModal}
                onClose={() => setShowAddTierModal(false)}
                onSave={handleAddTier}
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
                            <SplineAreaChart
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
