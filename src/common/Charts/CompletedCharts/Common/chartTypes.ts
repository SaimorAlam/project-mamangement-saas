/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Shared type definitions used across all chart components.
 */

export type ChartData = {
  name: string;
  [key: string]: number | string;
};

export type LegendValue = {
  label: string;
  field: string;
  color: string;
};

export type BreadcrumbItem = {
  id: string;
  name: string;
  level: number;
};

export type ChartType =
  | "BAR"
  | "AREA"
  | "HORIZONTAL_BAR"
  | "PIE"
  | "HEATMAP"
  | "LINE"
  | "SPLINE";

/** Common prop shape shared by all chart components */
export type BaseChartProps = {
  widgetTitle?: string;
  xAxisValues?: string[];
  legendValues?: LegendValue[];
  numOfLegendDataSet?: number;
  startingRange?: number;
  endingRange?: number;
  onToggleWidget?: () => void;
  onDelete?: () => void;
  tierLevel?: number;
  chartId?: string;
  projectId?: string;
  isCreationMode?: boolean;
  allUploadedData?: any;
  isPreview?: boolean;
  breadcrumbPath?: BreadcrumbItem[];
  onNavigate?: (level: number) => void;
  widgets?: any[];
};

