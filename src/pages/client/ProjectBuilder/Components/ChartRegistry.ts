import { lazy, ElementType } from "react";

export interface ChartRegistryItem {
  name: string;
  component: ElementType;
  isFullWidth?: boolean;
}

// Lazy components
export const DoughnutChart = lazy(
  () => import("@/common/Charts/DoughnutChart"),
);
export const HeatmapChart = lazy(() => import("@/common/Charts/HeatmapChart"));
export const RadarCharts = lazy(() => import("@/common/Charts/RadarChart"));
export const ProjectStats = lazy(
  () => import("@/components/client/ProgramBuilder/ProjectStats"),
);
export const DefaultChartData = lazy(() => import("./DefaultChartData"));

export const CHART_REGISTRY: Record<string, ChartRegistryItem> = {
  kpi: {
    name: "KPI",
    component: lazy(
      () => import("@/components/client/ProjectBuilder/chartModules/KpiModule"),
    ),
    isFullWidth: true,
  },
  "bar-chart": {
    name: "Bar Chart",
    component: lazy(
      () =>
        import("@/common/Charts/CompletedCharts/StackedBarChart/StackedBarChartModule"),
    ),
  },
  "progress-ring": {
    name: "Progress Ring",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/ProgressRingModule"),
    ),
  },
  "pie-chart": {
    name: "Pie Chart",
    component: lazy(
      () => import("@/common/Charts/CompletedCharts/PieChart/PieChartModule"),
    ),
  },
  "line-chart": {
    name: "Line Chart",
    component: lazy(
      () => import("@/common/Charts/CompletedCharts/LineChart/LineChartModule"),
    ),
  },
  "horizontal-bar-chart": {
    name: "Horizontal Bar Chart",
    component: lazy(
      () =>
        import("@/common/Charts/CompletedCharts/HorizontalBarChart/HorizontalBarChartModule"),
    ),
  },
  "area-chart": {
    name: "Area Chart",
    component: lazy(
      () =>
        import("@/common/Charts/CompletedCharts/ChartModule/ChartModuleOne"),
    ),
  },
  "heat-map-chart": {
    name: "Heat Map Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/HeatmapChartModule"),
    ),
  },
  "spline-area-chart": {
    name: "Spline Area Chart",
    component: lazy(
      () =>
        import("@/common/Charts/CompletedCharts/SplineAreaChart/SplineAreaChartModule"),
    ),
  },
  "sparklines-chart": {
    name: "Sparklines Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/SparkLineChartModule"),
    ),
  },
  "logarithmic-chart": {
    name: "Logarithmic Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/LogarithmicChartModule"),
    ),
  },
  "decomposition-tree": {
    name: "Decomposition Tree",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/DecompositionTreeModule"),
    ),
  },
  "gauge-chart": {
    name: "Gauge Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/GaugeChartModule"),
    ),
  },
  "histogram-chart": {
    name: "Histogram Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/HistogramChartModule"),
    ),
  },
  "bubble-chart": {
    name: "Bubble Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/BubbleChartModule"),
    ),
  },
  "column-chart": {
    name: "Column Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/ColumnBarChartModule"),
    ),
  },
  "funnel-chart": {
    name: "Funnel Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/FunnelChartModule"),
    ),
  },
  "scatter-chart": {
    name: "Scatter Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/ScatterChartModule"),
    ),
  },
  "pareto-chart": {
    name: "Pareto Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/ParetoChartModule"),
    ),
  },
  "waterfall-chart": {
    name: "Waterfall Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/WaterfallChartModule"),
    ),
  },
  "radar-chart": {
    name: "Radar Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/RadarChartModule"),
    ),
  },
  "candle-chart": {
    name: "Candle Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/CandleChartModule"),
    ),
  },
  "treemap-chart": {
    name: "Treemap Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/TreemapChartModule"),
    ),
  },
  "calendar-heatmap-chart": {
    name: "Calendar Heatmap",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/CalendarHeatmapModule"),
    ),
  },
  "gantt-new-chart": {
    name: "Gantt Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/GanttChartNewModule"),
    ),
  },
  "matrix-table-chart": {
    name: "Matrix Table",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/MatrixTableChartModule"),
    ),
  },
  "combo-chart": {
    name: "Combo Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/ComboChartModule"),
    ),
  },
  "horisontal-stacked-bar-chart": {
    name: "Horizontal Stacked Bar",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/HorizontalStackedBarChartModule"),
    ),
  },
  "bullet-chart": {
    name: "Bullet Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/BulletChartModule"),
    ),
  },
  "marimekko-chart": {
    name: "Marimekko Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/MarimekkoChartModule"),
    ),
  },
  "box-plot": {
    name: "Box Plot",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/BoxPlotChartModule"),
    ),
  },
  "cohort-analysis": {
    name: "Cohort Analysis",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/CohortAnalysisModule"),
    ),
  },
  "geographic-map": {
    name: "Geographic Map",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/GeographicMapModule"),
    ),
  },
  "rag-chart": {
    name: "RAG Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/RagChartModule"),
    ),
  },
  "ribbon-chart": {
    name: "Ribbon Chart",
    component: lazy(
      () =>
        import("@/components/client/ProjectBuilder/chartModules/RibbonChartModule"),
    ),
  },
};
