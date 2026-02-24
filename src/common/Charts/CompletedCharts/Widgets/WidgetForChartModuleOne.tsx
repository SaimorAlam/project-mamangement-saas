import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAppSelector } from "@/hooks/useRedux";
import {
  useCreateChartMutation,
  useCreateProgramChartMutation,
  useLazyGetRootChartQuery,
} from "@/store/Api/ChartApi/ChartApi";
import { useLazyGetProjectsByProgramIdQuery } from "@/store/Api/ProgramApi/ProgramApi";
import { toast } from "sonner";
import { useGetUser } from "@/hooks/useGetUser";
import { useLocation } from "react-router-dom";

export type LegendValue = {
  label: string;
  field: string;
  color: string;
};

const WidgetForChartModuleOne = ({
  widgedName,
  widgetTitle,
  widgetCategory,
  setWidgetTitle,
  numOfXAxisDataSet,
  handleSetNumOfXAxisDataSet,
  xAxisValues,
  handleXAxisValueChange,
  numOfLegendDataSet,
  setNumOfLegendDataSet,
  legendValues,
  setLegendValues,
  startingRange,
  setStartingRange,
  endingRange,
  setEndingRange,
  onClose,
  onDelete,
}: {
  widgedName: string;
  widgetTitle: string;
  widgetCategory: string;
  setWidgetTitle: React.Dispatch<React.SetStateAction<string>>;
  numOfXAxisDataSet: number;
  handleSetNumOfXAxisDataSet: (e: React.ChangeEvent<HTMLInputElement>) => void;
  xAxisValues: string[];
  handleXAxisValueChange: (index: number, value: string) => void;
  numOfLegendDataSet: number;
  setNumOfLegendDataSet: React.Dispatch<React.SetStateAction<number>>;
  legendValues: LegendValue[];
  setLegendValues: React.Dispatch<React.SetStateAction<LegendValue[]>>;
  startingRange: number;
  setStartingRange: React.Dispatch<React.SetStateAction<number>>;
  endingRange: number;
  setEndingRange: React.Dispatch<React.SetStateAction<number>>;
  onClose?: () => void;
  onDelete?: () => void;
}) => {
  // ── detect Program Builder context ────────────────────────────────────────
  const { pathname, state: locationState } = useLocation();
  const isProgramBuilder = pathname.split("/")[2] === "program-builder";
  const projectIdFromState = (locationState as { projectId?: string } | null)
    ?.projectId;

  const [projectId, setProjectId] = useState<string>("");
  const { name, role, profileImage, loading } = useGetUser();
  const projectIdFromSlice = useAppSelector(
    (state) => state?.chartSlice?.projectId,
  );
  const programIdFromSlice = useAppSelector(
    (state) => state?.chartSlice?.programId,
  );

  useEffect(() => {
    if (projectIdFromSlice) {
      setProjectId(projectIdFromSlice);
    }
    if (projectIdFromState) {
      setProjectId(projectIdFromState);
    }
  }, [projectIdFromSlice, projectIdFromState]);

  // ── Program Builder: Y-Axis cascading state ───────────────────────────────
  const [yAxisProjectId, setYAxisProjectId] = useState<string>("");
  const [yAxisChartId, setYAxisChartId] = useState<string>("");
  const [yAxisDataScope, setYAxisDataScope] = useState<string>("");
  const [createProgramChart] = useCreateProgramChartMutation();
  const [
    getProjectsByProgram,
    { data: programProjectsData, isLoading: isProgramProjectsLoading },
  ] = useLazyGetProjectsByProgramIdQuery();

  const [
    getRootChartByProject,
    { data: projectChartsData, isLoading: isProjectChartsLoading },
  ] = useLazyGetRootChartQuery();

  // Fetch projects when entering program-builder context
  useEffect(() => {
    if (isProgramBuilder && programIdFromSlice) {
      getProjectsByProgram({ programId: programIdFromSlice });
    }
  }, [isProgramBuilder, programIdFromSlice, getProjectsByProgram]);

  // Fetch root charts when a project is selected in y-axis panel
  useEffect(() => {
    if (isProgramBuilder && yAxisProjectId) {
      getRootChartByProject(yAxisProjectId);
    }
  }, [isProgramBuilder, yAxisProjectId, getRootChartByProject]);

  // Loose API item type used only within this component for response mapping
  type RawApiItem = Record<string, unknown>;

  const programProjects: { id: string; name: string }[] =
    (programProjectsData?.data?.data as RawApiItem[] | undefined)?.map((p) => ({
      id: p.id as string,
      name: p.name as string,
    })) ?? [];

  const rootCharts: { id: string; title: string; xAxis: unknown }[] = (
    (projectChartsData?.data ?? []) as RawApiItem[]
  ).map((c) => ({
    id: c.id as string,
    title: c.title as string,
    xAxis: c.xAxis,
  }));

  const selectedRootChart = rootCharts.find((c) => c.id === yAxisChartId);

  // Parse xAxis labels — skip header row, take first column of each data row
  const xAxisSliceLabels: string[] = (() => {
    if (!selectedRootChart?.xAxis) return [];
    try {
      let parsed: unknown = selectedRootChart.xAxis;
      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }
      // Handle scenario where it's wrapped in { labels: [...] }
      if (parsed && !Array.isArray(parsed) && typeof parsed === "object") {
        parsed = (parsed as Record<string, unknown>).labels;
      }

      if (Array.isArray(parsed)) {
        // If it's a 2D array of [label, value, ...], take first column
        if (Array.isArray(parsed[0])) {
          return (parsed as unknown[][]).map((row) => String(row[0] || ""));
        }
        // If it's already a flat array of labels
        return (parsed as unknown[]).map((v) => String(v));
      }
      return [];
    } catch (err) {
      console.error("Error parsing xAxis for mapping:", err);
      return [];
    }
  })();
  const [mappedData, setMappedData] = useState<
    (null | { projectId: string; charttableId: string; rowname: string })[]
  >([]);

  const handleAddMapping = () => {
    if (!yAxisDataScope) {
      toast.error("Please select a data scope first");
      return;
    }

    // Find first empty index in xAxisValues (up to numOfXAxisDataSet)
    let targetIndex = -1;
    for (let i = 0; i < numOfXAxisDataSet; i++) {
      if (!xAxisValues[i]) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex === -1) {
      toast.error(
        "All X-Axis fields are filled. Increase frequency/dataset count if needed.",
      );
      return;
    }

    // Map the selected scope to the next available X-axis field
    handleXAxisValueChange(targetIndex, yAxisDataScope);

    setMappedData((prev) => {
      const next = [...prev];
      // Ensure the array is long enough
      while (next.length <= targetIndex) {
        next.push(null);
      }
      next[targetIndex] = {
        projectId: yAxisProjectId,
        charttableId: yAxisChartId,
        rowname: yAxisDataScope,
      };
      return next;
    });

    toast.success(`Mapped "${yAxisDataScope}" to Field ${targetIndex + 1}`);
  };

  const [filter, setFilter] = useState<string>("");
  const [showFilter, setShowFilter] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [createChart, { isLoading }] = useCreateChartMutation();
  // for showing user info below
  const assignedBy = {
    name: !loading && name,
    role: !loading && role,
    image: !loading && profileImage,
  };

  // handler for Legend inputs
  const minLegend = 1;
  const maxLegend = 5;
  const handleSetNumOfLegendDataSet = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(e.target.value, 10);

    if (isNaN(value) || value < minLegend || value > maxLegend) {
      toast.error(
        `Please enter a number between ${minLegend} and ${maxLegend}`,
      );
      return;
    }

    setNumOfLegendDataSet(value);

    setLegendValues((prev) => {
      const updated = [...prev];

      while (updated.length < value) {
        updated.push({
          label: "",
          field: "",
          color: "#000000",
        });
      }
      return updated.slice(0, value);
    });
  };

  const handleLegendLabelChange = (index: number, value: string) => {
    setLegendValues((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        label: value,
        field: value.toLowerCase().replace(/\s+/g, ""),
      };
      return updated;
    });
  };

  const handleLegendColorChange = (index: number, color: string) => {
    setLegendValues((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        color: color,
      };
      return updated;
    });
  };
  // const [_getChartTitleId, { isLoading }] = useGetChartTitleIdMutation();

  const handleSaveChanges = async () => {
    // validating that if any of the legend labels or xAxisValues are empty, toast the user
    for (let i = 0; i < numOfLegendDataSet; i++) {
      if (!legendValues[i]?.label) {
        toast.error(`Please fill in the label for legend ${i + 1}`);
        return;
      }
    }

    for (let i = 0; i < numOfXAxisDataSet; i++) {
      if (!xAxisValues[i]) {
        toast.error(`Please fill in the value for X-Axis field ${i + 1}`);
        return;
      }
    }

    if (numOfXAxisDataSet < 1) {
      toast.error(`Please add at least 1 X-Axis value`);
      return;
    }

    if (legendValues.length < minLegend) {
      toast.error(
        `Please add at least ${minLegend} legend value${minLegend > 1 ? "s" : ""}`,
      );
      return;
    }
    if (!widgetCategory) {
      toast.error(`Please input category : ${widgetCategory}`);
      console.log("category: ", widgetCategory);
      return;
    }

    if (isProgramBuilder) {
      if (!yAxisProjectId) {
        toast.error("Please select a project for Y-Axis mapping");
        return;
      }
      if (!yAxisChartId) {
        toast.error("Please select a source chart for Y-Axis mapping");
        return;
      }
      if (!yAxisDataScope) {
        toast.error("Please select a data scope for Y-Axis mapping");
        return;
      }
    }

    const toastId = toast.loading("Creating chart...");
    // const payload = {
    //   numberOfDataset: numOfLegendDataSet,
    //   firstFieldDataset: startingRange,
    //   lastFieldDataset: endingRange,
    //   widgets: legendValues.map((l) => ({
    //     legendName: l.label,
    //     color: l.color,
    //   })),
    //   title: widgetTitle,
    //   status: "ACTIVE",
    //   category: widgetCategory,
    //   xAxis: JSON.stringify([
    //     // ["Label", ...legendValues.map((l) => l.label)],
    //     ...xAxisValues.map((label) => [
    //       label,
    //       ...Array(numOfLegendDataSet).fill(0),
    //     ]),
    //   ]),
    //   yAxis: JSON.stringify({}),
    //   zAxis: JSON.stringify({}),
    //   projectId: projectId ? projectId : projectIdFromState,
    //   ...(isProgramBuilder && {
    //     programid: programIdFromSlice,
    //     projectnumber: numOfXAxisDataSet,
    //     filter_By: filter || "string",
    //     valueDiteacts: mappedData
    //       .slice(0, numOfXAxisDataSet)
    //       .filter((item): item is NonNullable<typeof item> => !!item),
    //   }),
    //   rootchart: true,
    //   roottitle: widgetTitle,
    //   grouptitle: widgetTitle,
    // };
    const payload = {
      numberOfDataset: numOfLegendDataSet,
      firstFieldDataset: startingRange,
      lastFieldDataset: endingRange,

      widgets: legendValues.map((l) => ({
        legendName: l.label,
        color: l.color,
      })),

      filter_By: filter || "string",
      title: widgetTitle,
      status: "ACTIVE",
      category: widgetCategory,

      // -------- PROJECT-SPECIFIC FIELDS --------
      ...(!isProgramBuilder && {
        xAxis: JSON.stringify([
          [widgetTitle, ...legendValues.map((l) => l.label)],
          ...xAxisValues.map((label) => [
            label,
            ...Array(numOfLegendDataSet).fill(0),
          ]),
        ]),

        yAxis: JSON.stringify([]),
        zAxis: JSON.stringify([]),

        projectId: projectId ?? projectIdFromState,
        rootchart: true,
        roottitle: widgetTitle,
        grouptitle: widgetTitle,
      }),

      // -------- PROGRAM-SPECIFIC FIELDS --------
      ...(isProgramBuilder && {
        programid: programIdFromSlice,
        projectnumber: numOfXAxisDataSet,

        valueDiteacts: mappedData
          .slice(0, numOfXAxisDataSet)
          .filter((item): item is NonNullable<typeof item> => !!item),
      }),
    };

    try {
      const res = isProgramBuilder
        ? await createProgramChart(payload).unwrap()
        : await createChart(payload).unwrap();
      if (res?.success) {
        toast.success("Chart created successfully", { id: toastId });
        onDelete?.();
        onClose?.();
      }
    } catch {
      toast.error("Chart creation failed", { id: toastId });
    }
  };

  return (
    <div className="max-w-78 min-w-78 h-full bg-white border border-gray-100 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Widget Configuration
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4">
        {/* Stacked BarChart Widget Details Link */}
        <a href="#" className="text-xs text-blue-600 hover:underline">
          {widgedName} Widget Details
        </a>

        {/* Widget Title */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5 mt-5">
            Widget Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={widgetTitle}
            onChange={(e) => setWidgetTitle(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none"
          />
        </div>

        {/* Data Mapping for X-Axis Section */}
        <div>
          <h3 className="text-xs font-semibold text-blue-600 mb-3">
            Data Mapping for X-Axis
          </h3>

          {/* Number of Data sets */}
          <div className="flex items-center mb-3">
            <label className="text-xs text-gray-700 flex-1">
              Number of Data sets:
            </label>
            <input
              type="number"
              min={1}
              max={7}
              defaultValue={numOfXAxisDataSet}
              onChange={handleSetNumOfXAxisDataSet}
              className="w-12 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none"
            />
          </div>

          {/* Input all field Data */}
          <div className="mb-2">
            <label className="block text-xs text-gray-700 mb-1.5">
              Input {numOfXAxisDataSet >= 2 && "all"} field Data:
            </label>
            <div className="space-y-2">
              {Array.from({ length: numOfXAxisDataSet }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  required
                  placeholder={`Enter ${index + 1}${
                    index === 0
                      ? "st"
                      : index === 1
                        ? "nd"
                        : index === 2
                          ? "rd"
                          : "th"
                  } field name here...`}
                  value={xAxisValues[index] || ""}
                  onChange={(e) => {
                    handleXAxisValueChange(index, e.target.value);
                    if (isProgramBuilder) {
                      setMappedData((prev) => {
                        const next = [...prev];
                        next[index] = null;
                        return next;
                      });
                    }
                  }}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Show Filter */}
        <div className="flex items-center justify-between py-2">
          <label className="text-xs font-medium text-gray-700">
            Show Filter
          </label>
          <div className="relative inline-block w-10 h-5">
            <input
              type="checkbox"
              checked={showFilter}
              onChange={(e) => setShowFilter(e.target.checked)}
              className="sr-only peer"
            />
            <div
              onClick={() => setShowFilter(!showFilter)}
              className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${
                showFilter ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                  showFilter ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Filter By */}
        {showFilter && (
          <div className="flex items-center">
            <label className="text-xs text-gray-700 flex-1">Filter By:</label>
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pr-12 pl-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-500 appearance-none cursor-pointer focus:outline-none"
              >
                <option value="onTime">On time</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>

              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Data Mapping for Y-Axis Section */}
        <div>
          <h3 className="text-xs font-semibold text-blue-600 mb-3">
            Data Mapping for Y-Axis
          </h3>

          {/* Number of Data sets (Legends) */}
          <div className="flex items-center mb-3">
            <label className="text-xs text-gray-700 flex-1">
              Number of Legend sets:
            </label>
            <input
              type="number"
              min={minLegend}
              max={maxLegend}
              value={numOfLegendDataSet}
              onChange={handleSetNumOfLegendDataSet}
              className="w-12 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none"
            />
          </div>

          {isProgramBuilder ? (
            /* ── Program Builder: cascading Project → Chart → Scope dropdowns ── */
            <div className="space-y-3">
              {/* Project */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-700 w-24 shrink-0">
                  Project:
                </label>
                <div className="relative flex-1">
                  <select
                    value={yAxisProjectId}
                    onChange={(e) => {
                      setYAxisProjectId(e.target.value);
                      setYAxisChartId("");
                      setYAxisDataScope("");
                    }}
                    disabled={isProgramProjectsLoading}
                    className="w-full pr-7 pl-2 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-600 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="">
                      {isProgramProjectsLoading
                        ? "Loading..."
                        : "Select project"}
                    </option>
                    {programProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Source Chart */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-700 w-24 shrink-0">
                  Source Chart:
                </label>
                <div className="relative flex-1">
                  <select
                    value={yAxisChartId}
                    onChange={(e) => {
                      setYAxisChartId(e.target.value);
                      setYAxisDataScope("");
                    }}
                    disabled={!yAxisProjectId || isProjectChartsLoading}
                    className="w-full pr-7 pl-2 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-600 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="">
                      {isProjectChartsLoading
                        ? "Loading..."
                        : !yAxisProjectId
                          ? "Select project first"
                          : rootCharts.length === 0
                            ? "No root charts"
                            : "Select chart"}
                    </option>
                    {rootCharts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Data Scope — xAxis slice labels */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-700 w-24 shrink-0">
                  Data Scope:
                </label>
                <div className="relative flex-1">
                  <select
                    value={yAxisDataScope}
                    onChange={(e) => setYAxisDataScope(e.target.value)}
                    disabled={!yAxisChartId || xAxisSliceLabels.length === 0}
                    className="w-full pr-7 pl-2 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-600 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="">
                      {!yAxisChartId
                        ? "Select chart first"
                        : xAxisSliceLabels.length === 0
                          ? "No labels found"
                          : "Select scope"}
                    </option>
                    {xAxisSliceLabels.map((label) => (
                      <option key={label} value={label}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Map to X-Axis Button */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleAddMapping}
                  disabled={!yAxisDataScope}
                  className="px-3 py-1.5 text-[10px] font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                >
                  Map to X-Axis
                </button>
              </div>
            </div>
          ) : (
            /* ── Project Builder: standard numeric range inputs ── */
            <div className="space-y-2">
              {/* 1st field Data */}
              <div className="flex items-center">
                <label className="text-xs text-gray-700 flex-1">
                  1st field Data:
                </label>
                <input
                  type="number"
                  onChange={(e) => setStartingRange(Number(e.target.value))}
                  defaultValue={startingRange}
                  className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none"
                />
              </div>

              {/* Last field Data */}
              <div className="flex items-center">
                <label className="text-xs text-gray-700 flex-1">
                  Last field Data:
                </label>
                <input
                  type="number"
                  onChange={(e) => setEndingRange(Number(e.target.value))}
                  defaultValue={endingRange}
                  className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Display Settings Section */}
        <div>
          <h3 className="text-xs font-semibold text-blue-600 mb-3">
            Display Settings
          </h3>

          {/* Show Legend */}
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-medium text-gray-700">
              Show Legend
            </label>
            <div className="flex items-center gap-2">
              <div className="relative inline-block w-10 h-5">
                <input
                  type="checkbox"
                  checked={showLegend}
                  onChange={(e) => setShowLegend(e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  onClick={() => setShowLegend(!showLegend)}
                  className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${
                    showLegend ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                      showLegend ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {showLegend &&
            Array.from({ length: numOfLegendDataSet }).map((_, index) => (
              <div key={index}>
                {/* Legend Name */}
                <div className="flex items-center justify-between mb-2">
                  <label
                    className="text-xs text-gray-700"
                    style={{ width: "110px" }}
                  >
                    {index + 1}
                    {index === 0
                      ? "st"
                      : index === 1
                        ? "nd"
                        : index === 2
                          ? "rd"
                          : "th"}{" "}
                    Legend Name:
                  </label>

                  <input
                    type="text"
                    placeholder="Enter name here"
                    value={legendValues[index]?.label || ""}
                    onChange={(e) =>
                      handleLegendLabelChange(index, e.target.value)
                    }
                    className="w-[50%] px-2 py-1 text-xs border border-gray-300 rounded"
                  />
                </div>

                {/* Legend Color */}
                {widgedName === "Heatmap Chart" ? null : (
                  <div className="flex items-center mb-3">
                    <label
                      className="text-xs text-gray-700"
                      style={{ width: "110px" }}
                    >
                      {index + 1}
                      {index === 0
                        ? "st"
                        : index === 1
                          ? "nd"
                          : index === 2
                            ? "rd"
                            : "th"}{" "}
                      Legend Color:
                    </label>

                    <div className="flex items-center justify-end gap-2 flex-1">
                      <input
                        type="text"
                        value={legendValues[index]?.color || "#000000"}
                        onChange={(e) =>
                          handleLegendColorChange(index, e.target.value)
                        }
                        className="text-xs px-2 py-1 border border-gray-200 rounded w-22"
                      />

                      <input
                        type="color"
                        value={legendValues[index]?.color || "#000000"}
                        onChange={(e) =>
                          handleLegendColorChange(index, e.target.value)
                        }
                        className="w-14 h-6 rounded border border-gray-200 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Assigned By */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Assigned by
          </label>
          <div className="flex items-center">
            <img
              src={assignedBy?.image || ""}
              alt={assignedBy?.name || ""}
              className="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {assignedBy?.name || ""}
              </p>
              <p className="text-xs text-gray-500 font-normal">
                {assignedBy?.role || ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-1.5 text-xs font-medium border border-gray-200 rounded-md cursor-pointer text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          disabled={isLoading}
          className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 cursor-pointer"
          onClick={handleSaveChanges}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default WidgetForChartModuleOne;
