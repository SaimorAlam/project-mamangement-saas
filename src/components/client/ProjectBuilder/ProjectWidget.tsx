import React, { useEffect, useState } from "react";
import {
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Table,
  Circle,
  // GanttChartSquare,
  // Image,
  CircleGauge,
  ChartBarIncreasing,
  Flame,
  ChartArea,
  Gauge,
  Tally4,
  Bubbles,
  ChartScatter,
  Cone,
  ChartColumnBig,
  ChartColumnStacked,
  ChartLine,
  FileChartPie,
  SquareKanban,
  ChartCandlestick,
  Map,
  CalendarDays,
  SquareChartGantt,
  ChartNoAxesCombined,
  PanelTopBottomDashed,
  NotepadTextDashed,
  Users,
  Spline,
} from "lucide-react";
import useGetAllProgram from "./utils/useGetAllProgram";
import SelectSkeleton from "@/common/Skeleton/SelectSkeleton";
import useGetLazyProject from "./utils/useGetLazyProject";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  setProgramId,
  setProjectId,
} from "@/store/Slices/ChartSlice/ChartSlice";

interface Widget {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface ProjectWidgetProps {
  onWidgetSelect: (widgetId: string) => void;
  selectedWidgets: string[];
}

const ProjectWidget: React.FC<ProjectWidgetProps> = ({
  onWidgetSelect,
  selectedWidgets,
}) => {
  const { pathname } = useLocation();
  const isProgramBuilder = pathname.split("/")[2] === "program-builder";
  const { state } = useLocation();
  const { projectId: defaultProjectId, programId: defaultProgramId } =
    state || {};

  const { programId: reduxProgramId, projectId: reduxProjectId } =
    useAppSelector((state) => state.chartSlice);

  const [selectedProgram, setSelectedProgram] = useState<string>(
    reduxProgramId || defaultProgramId || "",
  );
  const [selectedProject, setSelectedProject] = useState<string>(
    reduxProjectId || defaultProjectId || "",
  );
  const widgets: Widget[] = [
    {
      id: "kpi",
      name: "KPI widget",
      description: "Display key metrics with trends",
      icon: <CircleGauge className="w-5 h-5" />,
    },
    {
      id: "bar-chart",
      name: "Stacked Bar Chart",
      description: "Compare data across categories",
      icon: <ChartColumnStacked className="w-5 h-5" />,
    },
    {
      id: "line-chart",
      name: "Line Chart",
      description: "Track changes over time",
      icon: <LineChartIcon className="w-5 h-5" />,
    },
    {
      id: "pie-chart",
      name: "Pie Chart",
      description: "Show proportions of a whole",
      icon: <PieChartIcon className="w-5 h-5" />,
    },
    {
      id: "horizontal-bar-chart",
      name: "Horizontal Bar Chart",
      description: "Show horizontal of a whole",
      icon: <ChartBarIncreasing className="w-5 h-5" />,
    },
    {
      id: "heat-map-chart",
      name: "Heat Map Chart",
      description: "Visualize data density with color intensity",
      icon: <Flame className="w-5 h-5" />,
    },
    {
      id: "area-chart",
      name: "Area Chart",
      description: "Show trends over time with filled areas",
      icon: <ChartArea className="w-5 h-5" />,
    },
    {
      id: "spline-area-chart",
      name: "Spline Area Chart",
      description: "Show trends over time with filled areas",
      icon: <ChartArea className="w-5 h-5" />,
    },
    {
      id: "sparklines-chart",
      name: "Sparklines Chart",
      description: "Show trends over time with filled areas",
      icon: <ChartArea className="w-5 h-5" />,
    },
    {
      id: "data-table",
      name: "Data Table",
      description: "Display detailed data records",
      icon: <Table className="w-5 h-5" />,
    },
    {
      id: "progress-ring",
      name: "Progress Ring",
      description: "Display progress or completion percentage",
      icon: <Circle className="w-5 h-5" />,
    },
    // {
    //   id: "gantt-chart",
    //   name: "Gantt Chart",
    //   description: "Visualize project timelines",
    //   icon: <GanttChartSquare className="w-5 h-5" />,
    // },
    // {
    //   id: "picture-video",
    //   name: "Picture/Video",
    //   description: "Add image or video",
    //   icon: <Image className="w-5 h-5" />,
    // },
    {
      id: "gauge-chart",
      name: "Gauge Chart",
      description: "Show gauge chart",
      icon: <Gauge className="w-5 h-5" />,
    },
    {
      id: "histogram-chart",
      name: "Histogram Chart",
      description: "Show histogram chart",
      icon: <Tally4 className="w-5 h-5" />,
    },
    {
      id: "bubble-chart",
      name: "Bubble Chart",
      description: "Show bubble chart",
      icon: <Bubbles className="w-5 h-5" />,
    },
    {
      id: "column-chart",
      name: "Column Chart",
      description: "Compare data across categories",
      icon: <ChartColumnBig className="w-5 h-5" />,
    },
    {
      id: "funnel-chart",
      name: "Funnel Chart",
      description: "Illustrate stages in a process or pipeline",
      icon: <Cone className="w-5 h-5" />,
    },
    {
      id: "scatter-chart",
      name: "Scatter Chart",
      description: "Show relationships between two variables",
      icon: <ChartScatter className="w-5 h-5" />,
    },
    {
      id: "pareto-chart",
      name: "Pareto Chart",
      description: "Highlight key factors (80/20 rule)",
      icon: <ChartLine className="w-5 h-5" />,
    },
    {
      id: "waterfall-chart",
      name: "Waterfall Chart",
      description: "Show cumulative effect of sequential values",
      icon: <SquareKanban className="w-5 h-5" />,
    },
    {
      id: "radar-chart",
      name: "Radar Chart",
      description: "Compare multiple variables across categories",
      icon: <FileChartPie className="w-5 h-5" />,
    },
    {
      id: "candle-chart",
      name: "Candle Chart",
      description: "Show candle chart",
      icon: <ChartCandlestick className="w-5 h-5" />,
    },
    {
      id: "treemap-chart",
      name: "Treemap Chart",
      description: "Show treemap chart",
      icon: <Map className="w-5 h-5" />,
    },
    {
      id: "calendar-heatmap-chart",
      name: "Calendar Heatmap Chart",
      description: "Show calendar heatmap chart",
      icon: <CalendarDays className="w-5 h-5" />,
    },
    {
      id: "gantt-new-chart",
      name: "Gantt New Chart",
      description: "Show gantt chart",
      icon: <SquareChartGantt className="w-5 h-5" />,
    },
    {
      id: "matrix-table-chart",
      name: "Matrix Table Chart",
      description: "Show matrix table chart",
      icon: <Table className="w-5 h-5" />,
    },
    {
      id: "combo-chart",
      name: "Combo Chart",
      description: "Show combo chart",
      icon: <ChartNoAxesCombined className="w-5 h-5" />,
    },
    {
      id: "horisontal-stacked-bar-chart",
      name: "Horisontal Stacked Bar Chart",
      description: "Show horisontal stacked bar chart",
      icon: <PanelTopBottomDashed className="w-5 h-5" />,
    },
    {
      id: "bullet-chart",
      name: "Bullet Chart",
      description: "Show bullet chart",
      icon: <NotepadTextDashed className="w-5 h-5" />,
    },
    {
      id: "logarithmic-chart",
      name: "Logarithmic Chart",
      description: "Display data on a logarithmic scale",
      icon: <ChartLine className="w-5 h-5" />,
    },
    {
      id: "decomposition-tree",
      name: "Decomposition Tree",
      description: "Visualize hierarchical data breakdown",
      icon: <SquareKanban className="w-5 h-5 rotate-90" />, // Rotated for tree-like look or just use existing
    },
    {
      id: "marimekko-chart",
      name: "Marimekko Chart",
      description: "Variable width stacked bars for mix/size",
      icon: <ChartColumnStacked className="w-5 h-5" />,
    },
    {
      id: "box-plot",
      name: "Box & Whisker Plot",
      description: "Distribution: median, quartiles, outliers",
      icon: <ChartCandlestick className="w-5 h-5" />,
    },
    {
      id: "cohort-analysis",
      name: "Cohort Analysis",
      description: "Track group survival/retention over time",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "geographic-map",
      name: "Geographic Map",
      description: "Choropleth or bubble overlays on global map",
      icon: <Map className="w-5 h-5" />,
    },
    {
      id: "rag-chart",
      name: "RAG Chart",
      description: "Monitor status with Red-Amber-Green zones",
      icon: <ChartLine className="w-5 h-5" />,
    },
    {
      id: "ribbon-chart",
      name: "Ribbon Chart",
      description: "Rank tracking flow chart",
      icon: <Spline className="w-5 h-5" />,
    },
    // {
    //   id: "rader-chart",
    //   name: "Rader Chart",
    //   description: "Division of same category",
    //   icon: <ChartScatter className="w-5 h-5" />,
    // },
  ];
  const { programs, isLoading } = useGetAllProgram();
  const {
    projects,
    isLoading: isProjectsLoading,
    isFetching: projectFetching,
  } = useGetLazyProject(selectedProgram, isProgramBuilder);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (reduxProgramId && !selectedProgram) {
      setSelectedProgram(reduxProgramId);
    }
    if (reduxProjectId && !selectedProject) {
      setSelectedProject(reduxProjectId);
    }
  }, [reduxProgramId, reduxProjectId, selectedProgram, selectedProject]);

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedProgram(val);
    dispatch(setProgramId(val));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedProject(val);
    dispatch(setProjectId(val));
  };

  return (
    <div className="bg-white shadow-lg border border-gray-100 rounded-lg h-screen max-w-78 min-w-78 flex flex-col sticky top-0">
      {/* Header */}
      {isLoading ? (
        <SelectSkeleton />
      ) : (
        <div className="px-4 pt-4">
          <label className="block text-sm font-medium text-website-color-darkGray mb-2">
            Program Name*
          </label>
          <div className="relative">
            <select
              value={selectedProgram}
              onChange={handleProgramChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-500 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Add program or select</option>
              {programs?.map((program: { id: string; name: string }) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
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
      {!isProgramBuilder &&
        (isProjectsLoading || projectFetching ? (
          <SelectSkeleton />
        ) : (
          <div className="px-4 pt-4">
            <label className="block text-sm font-medium text-website-color-darkGray mb-2">
              Project Name*
            </label>
            <div className="relative">
              <select
                value={selectedProject}
                onChange={handleProjectChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-500 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  {projects?.length > 0
                    ? "Select project"
                    : "No projects available"}
                </option>
                {projects?.length > 0 &&
                  projects?.map((project: { id: string; name: string }) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
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
        ))}

      <div className="px-4 pt-4">
        <label className="block text-sm font-medium text-website-color-darkGray mb-2">
          Use Template
        </label>
        <div className="relative">
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-500 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Template name</option>
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

      <div className="px-4 pt-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Widget Library
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Click widgets to add to the canvas
        </p>
      </div>

      {/* Widget Library */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Widget List */}
          <div className="flex flex-col gap-3">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                onClick={() => {
                  onWidgetSelect(widget.id);
                }}
                className={`flex items-start p-3 rounded-lg cursor-pointer transition-all border
                  ${selectedWidgets.includes(widget.id)
                    ? "bg-gray-200 border-transparent"
                    : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                  }`}
              >
                <div
                  className={`mt-0.5 ${selectedWidgets.includes(widget.id)
                    ? "text-website-color-darkGray"
                    : "text-gray-600"
                    }`}
                >
                  {widget.icon}
                </div>
                <div className="ml-3 flex-1">
                  <h3
                    className={`text-sm font-medium ${selectedWidgets.includes(widget.id) ||
                      (widget.id === "kpi" && selectedWidgets.length === 0)
                      ? "text-website-color-darkGray"
                      : "text-gray-900"
                      }`}
                  >
                    {widget.name}
                  </h3>
                  <p
                    className={`text-xs mt-0.5 ${selectedWidgets.includes(widget.id)
                      ? "text-website-color-darkGray"
                      : "text-gray-500"
                      }`}
                  >
                    {widget.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Instructions */}
        <div className=" py-6 border-t border-b border-gray-200">
          <p className="text-xs text-gray-600 leading-relaxed">
            Click on widgets to add them to your dashboard. Click on a placed
            widget to configure it.
          </p>
        </div>

        {/* Legend */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>
            <span className="text-xs text-gray-600">Draft</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs text-gray-600">Published</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
            <span className="text-xs text-gray-600">Needs Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectWidget;
