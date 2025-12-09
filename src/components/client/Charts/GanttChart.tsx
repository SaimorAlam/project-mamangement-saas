import { useEffect, useRef } from "react";
import { gantt } from "dhtmlx-gantt";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import {
  Download,
  FileText,
  MessageSquareText,
  Paperclip,
  Printer,
  Share2,
  Undo2,
} from "lucide-react";
import { CiExport } from "react-icons/ci";

import "dhtmlx-gantt/codebase/dhtmlxgantt.css";

const GanttChart: React.FC = () => {
  const ganttContainer = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    gantt.config.date_format = "%Y-%m-%d";
    gantt.config.fit_tasks = true;
    gantt.config.show_unscheduled = true;
    gantt.config.scale_height = 50;
    gantt.config.scroll_size = 18;
    gantt.init(ganttContainer.current as HTMLDivElement);
    gantt.parse({
      data: [
        {
          id: 1,
          text: "Task #1",
          start_date: "2025-10-24",
          duration: 30,
        },
        {
          id: 2,
          text: "Task #2",
          start_date: "2025-11-01",
          duration: 20,
        },
        {
          id: 3,
          text: "Task #3",
          start_date: "2025-12-01",
          duration: 15,
        },
      ],
    });
    return () => gantt.clearAll();
  }, []);

  // Export
  const exportToCSV = (): void => {
    const tasks = gantt.serialize().data;
    const csv = Papa.unparse(tasks);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "gantt-chart-export.csv");
  };

  // Import (🔥 modified part)
  const importFromCSV = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: any) => {
        // 🔥 All CSV fields kept intact
        const data = result.data.map((row: any, index: number) => ({
          ...row,
          id: row.id || index + 1,
        }));

        gantt.clearAll();
        gantt.parse({ data });
      },
      error: (err: Error) => {
        alert("Reading problem CSV: " + err);
      },
    });
  };

  // RESET FUNCTION
  const resetChart = (): void => {
    gantt.clearAll();
  };

  return (
    <div className="p-5 h-screen box-border border border-gray-200 rounded-lg mb-6">
      {/* Buttons */}
      <div className="mb-2.5 flex justify-between space-x-2.5">
        {/* left side header icon */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 pr-2">
            <Paperclip className="text-gray-500 w-5 h-5 cursor-pointer" />
            <FileText className="text-gray-500 w-5 h-5 cursor-pointer" />
            <MessageSquareText className="text-gray-500 w-5 h-5 cursor-pointer" />
          </div>
          <div className="flex items-center gap-2 border-l border-gray-400 pl-4">
            <Printer className="text-gray-500 w-5 h-5 cursor-pointer" />
            <Share2 className="text-gray-500 w-5 h-5 cursor-pointer" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={importFromCSV}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-3 bg-blue-500 text-white rounded-lg cursor-pointer text-sm font-medium hover:bg-blue-600"
          >
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Import
            </div>
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg cursor-pointer text-sm font-medium hover:bg-gray-300"
          >
            <div className="flex items-center gap-2">
              <CiExport className="w-5 h-5" />
              Export
            </div>
          </button>
          {/* RESET BUTTON */}
          <button
            onClick={resetChart}
            className="px-4 py-3 bg-red-400 text-white rounded-lg cursor-pointer text-sm font-medium hover:bg-red-500"
          >
            <div className="flex items-center gap-2">
              <Undo2 className="w-5 h-5" />
              Reset
            </div>
          </button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="w-full h-[calc(100vh-140px)] border border-gray-200 rounded-lg overflow-auto bg-gray-50">
        <div
          ref={ganttContainer}
          className="w-full h-full min-w-[800px]"
        />
      </div>
    </div>
  );
};

export default GanttChart;
