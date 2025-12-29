/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  AreaChart as ReAreaChart,
  Area,
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
import { generateAreaChartData } from "@/utils";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";

/*     TYPES     */

type ChartData = {
  name: string;
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

export default function AreaChart({
  widgetTitle = "My CSV",
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
  const [activeTier, setActiveTier] = useState<TierChart | null>(null);

  const [getChartTitleId] = useGetChartTitleIdMutation();

  /* ========= DATA ========= */

  const chartData: ChartData[] = useMemo(() => {
    if (!xAxisValues.length || !legendValues.length) return [];
    return generateAreaChartData(
      xAxisValues,
      legendValues,
      startingRange,
      endingRange
    );
  }, [xAxisValues, legendValues, startingRange, endingRange]);

  /* ========= TOTAL ========= */

  const totalValue = useMemo(() => {
    return chartData.reduce((sum, row) => {
      return (
        sum +
        legendValues.reduce(
          (inner, l) => inner + Number(row[l.field] || 0),
          0
        )
      );
    }, 0);
  }, [chartData, legendValues]);

  /* ========= ACTIONS ========= */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(chartData, null, 2));
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
      category: "AREA",
      xAxis: JSON.stringify({
        labels: xAxisValues,
        values: [],
      }),
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

  const handleAddTier = (tierName: string) => {
    const newTier: TierChart = {
      id: `${chartId}-tier-${Date.now()}`,
      name: tierName,
      xAxisValues,
      legendValues,
      children: [],
    };

    setChildTiers([...childTiers, newTier]);
    setActiveTier(newTier);
    setShowAddTierModal(false);
  };

  /* ========= TOOLTIP ========= */

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

  /* ========= RENDER ========= */

  return (
    <>
      <div className="w-full bg-white border border-gray-200 rounded-lg p-6">
        {tierLevel > 0 && (
          <div className="mb-4 text-sm text-gray-500">
            {"→ ".repeat(tierLevel)} Tier Level {tierLevel}
          </div>
        )}

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
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">Total {totalValue}</p>

            <div className="relative border-l pl-4">
              <button
                onClick={() => setShowPopover(!showPopover)}
                className="p-2 border rounded hover:bg-gray-50"
              >
                <BsThreeDots size={18} />
              </button>

              {showPopover && (
                <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg p-2 w-48 z-10">
                  <MenuItem icon={<Copy />} label="Copy" onClick={handleCopy} />
                  <MenuItem
                    icon={<Download />}
                    label="Download"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  />
                  <MenuItem icon={<Trash2 />} label="Delete" danger />
                  {onToggleWidget && (
                    <MenuItem
                      icon={<MdOutlineWidgets />}
                      label="Widget"
                      onClick={onToggleWidget}
                    />
                  )}
                  <MenuItem
                    icon={<GoPlus />}
                    label="Add Tier"
                    onClick={() => setShowAddTierModal(true)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CHART */}
        <ResponsiveContainer width="100%" height={350}>
          <ReAreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[startingRange, endingRange]} />
            <Tooltip content={<CustomTooltip />} />

            {legendValues.map((l) => (
              <Area
                key={l.field}
                dataKey={l.field}
                type="monotone"
                stackId="1"
                stroke={l.color}
                fill={l.color}
                fillOpacity={0.3}
              />
            ))}
          </ReAreaChart>
        </ResponsiveContainer>
      </div>

      {/* TIER MODALS */}
      <AddTierModal
        isOpen={showAddTierModal}
        onClose={() => setShowAddTierModal(false)}
        onSave={handleAddTier}
        parentChartName={widgetTitle}
      />

      {activeTier && (
        <TierChartModal
          isOpen
          onClose={() => setActiveTier(null)}
          tierLevel={tierLevel + 1}
        >
          <AreaChart
            widgetTitle={activeTier.name}
            xAxisValues={activeTier.xAxisValues}
            legendValues={activeTier.legendValues}
            numOfLegendDataSet={activeTier.legendValues.length}
            startingRange={startingRange}
            endingRange={endingRange}
            tierLevel={tierLevel + 1}
            chartId={activeTier.id}
          />
        </TierChartModal>
      )}
    </>
  );
}

/* ===== SMALL MENU ITEM ===== */

function MenuItem({
  icon,
  label,
  onClick,
  disabled,
  danger,
}: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left hover:bg-gray-50 ${
        danger ? "text-red-600" : ""
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
