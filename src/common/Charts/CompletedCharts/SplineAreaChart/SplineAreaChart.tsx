/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactApexChart from "react-apexcharts";
import { generateAreaChartData } from "@/utils/clientPannelHelpers/programBuilderHelpers";

// Common Imports
import { BaseChartProps } from "../Common/chartTypes";
import {
  parseCommonChartData,
} from "../Common/chartUtils";
import BaseChartContainer from "../Common/BaseChartContainer";

/**
 * Parse xAxis 2D array format from API
 */
export const parseSplineChartData = (
  xAxis: any[][] | string | { labels: any[][] },
  legendValues: any[],
  widgetTitle: string,
) => {
  return parseCommonChartData(xAxis, legendValues, widgetTitle);
};

/* ---------- COMPONENT ---------- */

export default function SplineAreaChart(props: BaseChartProps) {
  const getTierLegends = (tier: any) => {
      return (tier?.splineChart?.widgets || tier?.widgets || []).map((w: any) => ({
          label: w.legendName || w.label,
          field: (w.legendName || w.label)?.toLowerCase().replace(/\s+/g, ""),
          color: w.color,
      }));
  };

  return (
    <BaseChartContainer
      {...props}
      category="SPLINE"
      excelType="splineChart"
      generatorFunc={generateAreaChartData}
      getTierLegends={getTierLegends}
      parseTierData={parseSplineChartData}
      renderChildChart={(tier, childProps) => (
        <SplineAreaChart {...childProps} key={tier.id} />
      )}
    >
      {({ chartData, safeStartingRange, safeEndingRange, effectiveLegendValues, effectiveXAxisValues }) => {
        const series = effectiveLegendValues.map((l) => ({
          name: l.label,
          data: (chartData as any[]).map((row) => Number(row[l.field] || 0)),
        }));

        const chartOptions: any = {
          chart: {
            type: "area",
            height: 350,
            toolbar: { show: false },
            zoom: { enabled: false },
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
            categories: effectiveXAxisValues,
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
            min: safeStartingRange,
            max: safeEndingRange,
          },
          tooltip: {
            shared: true,
            intersect: false,
          },
          legend: {
            show: false,
            position: "top",
            horizontalAlign: "right",
          },
        };

        return (
          <div className="p-4">
            <ReactApexChart
              options={chartOptions}
              series={series}
              type="area"
              height={350}
            />
          </div>
        );
      }}
    </BaseChartContainer>
  );
}
