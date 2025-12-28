import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Copy, Trash2, Download } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWidgets } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";
import { generateChartData } from "@/utils";

/*       TYPES       */

export type ChartData = {
  name: string;
  [key: string]: number | string;
};

type LegendValue = {
  label: string;
  field: string;
  color: string;
};

type Props = {
  widgetTitle?: string;
  xAxisValues?: string[];
  legendValues?: LegendValue[];
  numOfLegendDataSet?: number;
  startingRange: number;
  endingRange: number;
  onToggleWidget?: () => void;
};

/*       COMPONENT       */

export default function StackedBarChart({
  widgetTitle = "My CSV",
  xAxisValues = [],
  legendValues = [],
  numOfLegendDataSet = 1,
  startingRange,
  endingRange,
  onToggleWidget,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  const [getChartTitleId] = useGetChartTitleIdMutation();

  /*   DATA   */
  const chartData: ChartData[] = useMemo(() => {
    if (!xAxisValues.length || !legendValues.length) return [];
    return generateChartData(
      xAxisValues,
      legendValues,
      numOfLegendDataSet,
      startingRange,
      endingRange
    );
  }, [
    xAxisValues,
    legendValues,
    numOfLegendDataSet,
    startingRange,
    endingRange,
  ]);

  /*   TOTAL   */
  const totalEmployees = useMemo(() => {
    return chartData.reduce((sum, row) => {
      return (
        sum +
        legendValues.reduce((inner, l) => inner + Number(row[l.field] || 0), 0)
      );
    }, 0);
  }, [chartData, legendValues]);

  /*   ACTIONS   */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(chartData, null, 2));
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

  /*   TOOLTIP   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const row = payload[0].payload;

    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold mb-2">{row.name}</p>
        {legendValues.map((l) => (
          <p key={l.field} style={{ color: l.color }} className="text-sm">
            {l.label}: {row[l.field]}
          </p>
        ))}
      </div>
    );
  };

  /*   RENDER   */

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">{widgetTitle}</h2>
          <div className="flex gap-6 mt-3">
            {legendValues.map((l) =>
              l.label ? (
                <div key={l.field} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: l.color }}
                  />
                  <span className="text-sm">{l.label}</span>
                </div>
              ) : null
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">Total {totalEmployees}</p>

          <div className="flex gap-2 border-l border-gray-300 pl-4 relative">
            <button
              onClick={() => setShowPopover(!showPopover)}
              className="p-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              <BsThreeDots size={18} />
            </button>

            {showPopover && (
              <div className="absolute right-0 top-12 bg-white border border-gray-300 rounded-lg shadow-lg p-2 w-48 z-10">
                <button
                  onClick={() => {
                    handleCopy();
                    setShowPopover(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                >
                  <Copy size={18} />
                  <span>Copy</span>
                </button>

                <button
                  onClick={() => {
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
                  onClick={() => setShowPopover(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left text-red-600"
                >
                  <Trash2 size={18} />
                  <span>Delete</span>
                </button>

                <button
                  onClick={handleWidgetClick}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                >
                  <MdOutlineWidgets size={18} />
                  <span>Widget</span>
                </button>

                <button
                  onClick={() => setShowPopover(false)}
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

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis domain={[startingRange, endingRange]} />
          <Tooltip content={<CustomTooltip />} />
          {legendValues.map((l, i) => (
            <Bar
              key={l.field}
              dataKey={l.field}
              stackId="a"
              fill={l.color}
              radius={i === legendValues.length - 1 ? [4, 4, 0, 0] : 0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
