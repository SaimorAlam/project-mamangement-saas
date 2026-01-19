import React, { useState } from "react";
import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Table,
  Circle,
  GanttChartSquare,
  Image,
  CircleGauge,
  ChartBarIncreasing,
  Flame,
  ChartArea,
} from "lucide-react";

interface Widget {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface ProjectWidgetProps {
  onWidgetSelect: (widgetId: string) => void;
}

const WidgetLibrary: React.FC<ProjectWidgetProps> = ({
  onWidgetSelect,
}) => {
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedWidget, setSelectedWidget] = useState<string>("kpi");

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
      icon: <BarChart3 className="w-5 h-5" />,
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
      description: "Show heat map",
      icon: <Flame className="w-5 h-5" />,
    },
    {
      id: "area-chart",
      name: "Area Chart",
      description: "Show area chart",
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
      description: "Show completion percentage",
      icon: <Circle className="w-5 h-5" />,
    },
    {
      id: "gantt-chart",
      name: "Gantt Chart",
      description: "Visualize project timelines",
      icon: <GanttChartSquare className="w-5 h-5" />,
    },
    {
      id: "picture-video",
      name: "Picture/Video",
      description: "Add image or video",
      icon: <Image className="w-5 h-5" />,
    },
  ];

  return (
    <div className="bg-white shadow-lg border border-gray-100 rounded-lg h-screen max-w-76 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4">
        <label className="block text-sm font-medium text-website-color-darkGray mb-2">
          Program Name*
        </label>
        <div className="relative">
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-500 appearance-none cursor-pointer focus:outline-none"
          >
            <option value="">Add program or select</option>
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

      {/* Widget Library */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Widget Library
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Drag widgets to the canvas
          </p>

          {/* Widget List */}
          <div className="flex flex-col gap-3">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                onClick={() => {
                  setSelectedWidget(widget.id);
                  onWidgetSelect(widget.id);
                }}
                className={`flex items-start p-3 rounded-lg cursor-pointer transition-all border
                  ${
                    selectedWidget === widget.id
                      ? "bg-gray-200 border-transparent"
                      : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                  }`}
              >
                <div
                  className={`mt-0.5 ${
                    selectedWidget === widget.id
                      ? "text-website-color-darkGray"
                      : "text-gray-600"
                  }`}
                >
                  {widget.icon}
                </div>
                <div className="ml-3 flex-1">
                  <h3
                    className={`text-sm font-medium ${
                      selectedWidget === widget.id
                        ? "text-website-color-darkGray"
                        : "text-gray-900"
                    }`}
                  >
                    {widget.name}
                  </h3>
                  <p
                    className={`text-xs mt-0.5 ${
                      selectedWidget === widget.id
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
            Drag and drop widgets to add them to your dashboard. Click
            on a placed widget to configure it.
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

export default WidgetLibrary;
