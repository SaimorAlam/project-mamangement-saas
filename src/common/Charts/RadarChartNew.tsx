/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
    Radar,
    RadarChart as ReRadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { Copy, Trash2, Download } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWidgets } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";

/*     TYPES     */

type RadarDataPoint = {
    metric: string;
    [key: string]: number | string;
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
    widgetTitle?: string;
    xAxisValues?: string[];
    legendValues?: LegendValue[];
    numOfLegendDataSet?: number;
    startingRange: number;
    endingRange: number;
    onToggleWidget?: () => void;
    tierLevel?: number;
    chartId?: string;
};

/*     COMPONENT     */

export default function RadarChartNew({
    widgetTitle = "Radar Chart",
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

    /* ========= DATA ========= */

    const radarData: RadarDataPoint[] = useMemo(() => {
        if (!xAxisValues.length || !legendValues.length) return [];

        return xAxisValues.filter(Boolean).map((metric, index) => {
            const dataPoint: RadarDataPoint = { metric };

            legendValues.forEach((legend) => {
                if (legend.label) {
                    // Generate normalized values (0-1) for radar
                    const normalizedValue =
                        (startingRange +
                            ((endingRange - startingRange) *
                                ((index + legendValues.indexOf(legend) * 7) % 10)) / 10) /
                        endingRange;
                    dataPoint[legend.field] = Math.min(Math.max(normalizedValue, 0), 1);
                }
            });

            return dataPoint;
        });
    }, [xAxisValues, legendValues, startingRange, endingRange]);

    /* ========= CENTER METRIC ========= */

    const centerMetric = useMemo(() => {
        if (!radarData.length || !legendValues.length) return null;

        // Calculate average of first legend's values
        const firstLegend = legendValues.find(l => l.label);
        if (!firstLegend) return null;

        const sum = radarData.reduce(
            (acc, dp) => acc + Number(dp[firstLegend.field] || 0),
            0
        );
        const avg = sum / radarData.length;

        return {
            label: xAxisValues[0] || "Average",
            value: (avg * 100).toFixed(0) + "%",
        };
    }, [radarData, legendValues, xAxisValues]);

    /* ========= ACTIONS ========= */

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(radarData, null, 2));
    };

    const handleDownload = () => {
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
            xAxis: JSON.stringify({
                labels: xAxisValues,
                values: [],
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
            legendValues
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

    /* ========= TOOLTIP ========= */

    const CustomTooltip = ({ active, payload }: any) => {
        if (!active || !payload?.length) return null;

        return (
            <div className="bg-white p-3 border rounded shadow-lg">
                <p className="font-semibold mb-2">{payload[0].payload.metric}</p>
                {payload.map((p: any) => (
                    <p key={p.dataKey} style={{ color: p.stroke }} className="text-sm">
                        {p.name}: {(p.value * 100).toFixed(0)}%
                    </p>
                ))}
            </div>
        );
    };

    /* ========= RENDER ========= */

    return (
        <>
            <div
                className={`w-full bg-white border border-gray-200 rounded-lg p-6 ${childTiers.length > 0 ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
                    }`}
                onClick={handleChartClick}
            >
                {/* HEADER */}
                <div className="flex justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">{widgetTitle}</h2>

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
                    </div>

                    {/* ACTION MENU */}
                    <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
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

                {/* CHART */}
                <div className="relative">
                    <ResponsiveContainer width="100%" height={400}>
                        <ReRadarChart data={radarData}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis
                                dataKey="metric"
                                tick={{ fill: "#6b7280", fontSize: 12 }}
                            />
                            <PolarRadiusAxis
                                angle={90}
                                domain={[0, 1]}
                                tick={{ fill: "#6b7280", fontSize: 10 }}
                                tickCount={5}
                            />
                            <Tooltip content={<CustomTooltip />} />

                            {legendValues.map((l, index) =>
                                l.label ? (
                                    <Radar
                                        key={l.field}
                                        name={l.label}
                                        dataKey={l.field}
                                        stroke={l.color}
                                        fill={l.color}
                                        fillOpacity={index === 0 ? 0.5 : 0.2}
                                    />
                                ) : null
                            )}
                        </ReRadarChart>
                    </ResponsiveContainer>

                    {/* CENTER METRIC */}
                    {centerMetric && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <div className="text-xs text-gray-500">{centerMetric.label}</div>
                            <div className="text-lg font-semibold text-gray-800">
                                {centerMetric.value}
                            </div>
                        </div>
                    )}
                </div>

                {/* Indicator if chart has children */}
                {childTiers.length > 0 && (
                    <div className="mt-4 text-center">
                        <p className="text-sm text-blue-600 font-medium">
                            Click chart to view {childTiers.length} child tier{childTiers.length > 1 ? "s" : ""}
                        </p>
                    </div>
                )}
            </div>

            {/* TIER MODALS */}
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
                            <RadarChartNew
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
    );
}


