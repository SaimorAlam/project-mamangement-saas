import { useMemo, useState, useEffect } from "react";
import { BreadcrumbItem } from "./chartTypes";
import {
  useLazyFindChildrenValueQuery,
  useLazyGetAllTheLeafChartQuery,
} from "@/store/Api/ChartApi/ChartApi";

export const useChartTierState = (
  chartId: string,
  widgetTitle: string,
  tierLevel: number,
  breadcrumbPath: BreadcrumbItem[] = [],
  onNavigate?: (level: number) => void,
) => {
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [showChildrenModal, setShowChildrenModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [findChildrenValue, { data: childrenResponse, isLoading }] =
    useLazyFindChildrenValueQuery();
  const [getAllTheLeafChart] = useLazyGetAllTheLeafChartQuery();

  const childTiers = childrenResponse?.data || [];

  useEffect(() => {
    if (chartId && chartId !== "root") {
      findChildrenValue(chartId);
    }
  }, [chartId, findChildrenValue]);

  const currentBreadcrumbs = useMemo(() => {
    const base =
      breadcrumbPath.length === 0
        ? [{ id: "dashboard", name: "Dashboard", level: -1 }]
        : breadcrumbPath;
    return [
      ...base,
      { id: chartId || "root", name: widgetTitle, level: tierLevel },
    ];
  }, [breadcrumbPath, chartId, widgetTitle, tierLevel]);

  const handleChildNavigate = (targetLevel: number) => {
    if (targetLevel < tierLevel) {
      setShowChildrenModal(false);
      if (onNavigate) onNavigate(targetLevel);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const target = currentBreadcrumbs[index];
    if (index < currentBreadcrumbs.length - 1) {
      if (onNavigate) {
        onNavigate(target.level);
      }
      setShowChildrenModal(false);
    }
  };

  return {
    showAddTierModal,
    setShowAddTierModal,
    showChildrenModal,
    setShowChildrenModal,
    isDownloading,
    setIsDownloading,
    childTiers,
    isLoading,
    currentBreadcrumbs,
    handleChildNavigate,
    handleBreadcrumbClick,
    getAllTheLeafChart,
  };
};
