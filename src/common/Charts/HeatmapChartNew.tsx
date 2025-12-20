"use client";

import { useMemo, useState, MouseEvent } from "react";
import { Copy, Download, Trash2 } from "lucide-react";
import { LegendValue } from "@/components/client/ProjectBuilder/WidgetForChartModuleOne";

interface TooltipData {
    row: string;
    column: string;
    value: number;
    x: number;
    y: number;
}

type Props = {
    widgetTitle: string;
    xAxisValues: string[];
    legendValues: LegendValue[];
    startingRange: number;
    endingRange: number;
};

export default function HeatmapChartNew({
    widgetTitle,
    xAxisValues,
    legendValues,
    startingRange,
    endingRange,
}: Props) {
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);

    // Generate matrix ONCE (no random on hover)
    const heatmapData = useMemo(() => {
        return legendValues
            .filter((l) => l.label)
            .map((legend) => ({
                label: legend.label,
                values: xAxisValues
                    .filter((x) => x)
                    .map(() =>
                        Math.floor(
                            Math.random() * (endingRange - startingRange + 1) +
                            startingRange
                        )
                    ),
            }));
    }, [legendValues, xAxisValues, startingRange, endingRange]);

    const getColor = (value: number) => {
        const range = endingRange - startingRange;
        const percent = (value - startingRange) / range;

        if (percent < 0.25) return "bg-[#CCE3DE]";
        if (percent < 0.5) return "bg-[#A4C3B2]";
        if (percent < 0.75) return "bg-[#6B9080]";
        return "bg-[#6B9080]";
    };

    const handleHover = (
        row: string,
        column: string,
        value: number,
        e: MouseEvent<HTMLDivElement>
    ) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
            row,
            column,
            value,
            x: rect.left + rect.width / 2,
            y: rect.top,
        });
    };

    const handleDownloadCSV = () => {
        const randomId = crypto.randomUUID().slice(0, 8);

        const header = ["", ...xAxisValues].join(",");
        const rows = legendValues.map(
            (l) => `${l.label}${",".repeat(xAxisValues.length)}`
        );

        const csvContent = [header, ...rows].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${widgetTitle}-${randomId}.csv`;
        link.click();

        URL.revokeObjectURL(url);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(legendValues, null, 2));
    };

    const handleDelete = () => {
        console.log("Reset handled by parent widget");
    };

    return (
        <div className="w-[70%] bg-white rounded-lg border border-gray-200 p-6 relative">
            {/* Header */}
            <div className="flex justify-between mb-6">
                <h2 className="text-lg font-semibold">{widgetTitle}</h2>
                <div className="flex gap-5">
                    <button onClick={handleDownloadCSV} title="Export CSV">
                        <Download size={18} />
                    </button>
                    <button onClick={handleCopy} title="Copy">
                        <Copy size={18} />
                    </button>
                    <button onClick={handleDelete} title="Reset">
                        <Trash2 size={18} />
                    </button>
                </div>

            </div>

            <div className="w-full flex items-center justify-between gap-4 mb-18">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2"> Range:
                </span>
                <div className="flex items-center justify-end gap-2">
                    {[
                        { color: "bg-[#CCE3DE]", range: `${startingRange}-${Math.floor(endingRange / 3)}` },
                        { color: "bg-[#A4C3B2]", range: `${Math.floor(endingRange / 3) + 1}-${Math.floor(endingRange * 2 / 3)}` },
                        { color: "bg-[#6B9080]", range: `${Math.floor(endingRange * 2 / 3) + 1}-${endingRange}` }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-1">
                            <div className={`w-6 h-6 rounded ${item.color}`} />
                            <span className="text-sm text-gray-600"> {item.range} </span>
                        </div>))}
                </div>
            </div>

            {/* Heatmap */}
            <div className="w-full overflow-x-auto ">
                <div className="w-full  flex flex-col items-center pr-22">
                    {/* Rows */}
                    {heatmapData.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex mb-2">
                            <div className="w-32 text-sm text-gray-700 pr-4  my-auto text-right text-wrap">
                                {row.label}
                            </div>

                            {row.values.map((value, colIndex) => (
                                <div
                                    key={colIndex}
                                    className={`w-24 h-20 rounded mx-0.5 cursor-pointer transition hover:ring-2 hover:ring-teal-400 ${getColor(
                                        value
                                    )}`}
                                    onMouseEnter={(e) =>
                                        handleHover(
                                            row.label,
                                            xAxisValues[colIndex],
                                            value,
                                            e
                                        )
                                    }
                                    onMouseLeave={() => setTooltip(null)}
                                />
                            ))}
                        </div>
                    ))}

                    {/* Column Headers */}
                    <div className="flex mb-2">
                        <div className="w-32 shrink-0" />
                        {xAxisValues
                            .filter((x) => x)
                            .map((x, i) => (
                                // i want that if text is too long it should wrap
                                <div
                                    key={i}
                                    className="w-24 mr-1 text-wrap overflow-hidden h-22 text-center text-sm font-medium text-gray-600  "
                                >
                                    {x}
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="fixed z-50 bg-gray-900 text-white text-xs rounded px-3 py-2"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y - 8,
                        transform: "translate(-50%, -100%)",
                    }}
                >
                    <div className="font-semibold">{tooltip.row}</div>
                    <div className="text-gray-300">{tooltip.column}</div>
                    <div className="font-bold text-teal-300">{tooltip.value}</div>
                </div>
            )}

            {xAxisValues.length === 0 && (
                <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400">No data selected. Please fill all input values for visual.</div>

            )}
        </div>
    );
}
