/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";

import Papa from "papaparse";
import { saveAs } from "file-saver";

import {
  Plus,
  Trash2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Download,
} from "lucide-react";
import { CiExport } from "react-icons/ci";

/* ===== COLOR POOL FOR ROOT PROJECTS ===== */
const PROJECT_COLORS = [
  "#22c55e", // green
  "#eab308", // yellow
  "#3b82f6", // blue
  "#ec4899", // pink
  "#8b5cf6", // purple
  "#f97316", // orange
];

const GanttChart = () => {
  const ganttContainer = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    gantt.clearAll();

    gantt.plugins({
      undo: true,
      marker: true,
      tooltip: true,
    });

    //    CORE CONFIG   
    gantt.config.date_format = "%Y-%m-%d";
    gantt.config.drag_progress = true;
    gantt.config.drag_resize = true;
    gantt.config.drag_move = true;
    gantt.config.grid_resize = true;
    gantt.config.fit_tasks = true;
    gantt.config.order_branch = true;
    gantt.config.order_branch_free = true;
    gantt.config.autosize = "y";

    //   AUTO RECALCULATE PARENTS
    gantt.config.auto_scheduling = true;
    gantt.config.auto_scheduling_strict = true;
    gantt.config.open_tree_initially = true;

    // Open edit modal on double click
    gantt.attachEvent("onTaskDblClick", function (id) {
      gantt.showLightbox(id);   // opens full edit dialog
      return false;             // prevent default behavior
    });
    gantt.config.details_on_dblclick = true;
    gantt.config.details_on_create = true;
    gantt.config.lightbox.sections = [
      { name: "text", height: 38, map_to: "text", type: "textarea", focus: true },
      { name: "owner", height: 30, map_to: "owner", type: "textarea" },
      { name: "time", type: "duration", map_to: "auto" }
    ];
    gantt.config.editable = false;
    // gantt.config.readonly = true;



    //    COLUMNS (LEFT SHEET)   
    gantt.config.columns = [
      //   ROW NUMBER COLUMN (FIRST)
      {
        name: "all",
        label: "All",
        align: "center",
        width: 70,
        template: (task) => {
          // Global visible row index (1-based)
          return gantt.getGlobalTaskIndex(task.id) + 1;
        },
      },

      // Task tree
      { name: "text", label: "Task name", tree: true, width: 260, resize: true, editor: { type: "text", map_to: "text" } },

      { name: "duration", label: "Duration", align: "center", width: 90, editor: { type: "number", map_to: "duration" } },

      {
        name: "start_date",
        label: "Start Date",
        align: "center",
        width: 110,
        editor: { type: "date", map_to: "start_date" }
      },

      {
        name: "end_date",
        label: "Finished Date",
        align: "center",
        width: 110,
        template: (task) => task.end_date ? gantt.templates.date_grid(task.end_date, task, "end_date") : "",
      },

      { name: "owner", label: "Assigned", align: "center", width: 130, editor: { type: "text", map_to: "owner" } },

      // ➕ ADD CHILD
      {
        name: "add",
        label: "",
        width: 44,
        template: () => `<span class="add-child-btn" title="Add child task">+</span>`,
      },

      // 🗑️ DELETE
      {
        name: "delete",
        label: "",
        width: 44,
        template: () => `<span class="delete-btn-hover w-5 h-3" title="Double click to delete task">-</span>`,
      },
    ];


    //    ZOOM   
    gantt.ext.zoom.init({
      levels: [
        {
          name: "month",
          scale_height: 60,
          min_column_width: 60,
          scales: [
            { unit: "month", step: 1, format: "%F %Y" },
            { unit: "day", step: 2, format: (d: Date) => d.getDate() },
          ],
        },
        {
          name: "week",
          scale_height: 60,
          min_column_width: 50,
          scales: [
            { unit: "week", step: 1, format: "Week %W" },
            { unit: "day", step: 1, format: "%d" },
          ],
        },
      ],
    });

    gantt.ext.zoom.setLevel("month");

    //    TODAY MARKER   
    gantt.addMarker({
      start_date: new Date(),
      css: "today",
      text: "Today",
    });

    //    COLOR SYSTEM   
    gantt.templates.task_class = function (_start, _end, task) {
      if (task.rootColor) return "task-root-" + task.rootColor;
      return "";
    };

    // Assign color to root projects
    gantt.attachEvent("onTaskCreated", function (task) {
      if (!task.parent || task.parent === 0) {
        const index = gantt.getTaskCount() % PROJECT_COLORS.length;
        task.rootColor = index;
      }
      return true;
    });

    // Inherit parent color
    gantt.attachEvent("onBeforeTaskAdd", function (_id, task) {
      if (task.parent) {
        const parent = gantt.getTask(task.parent);
        task.rootColor = parent.rootColor;
      }
      return true;
    });

    //    BUTTON HANDLERS   
    (gantt as any).attachEvent("onGridClick", function (id: any, e: any) {
      const target = e.target as HTMLElement;

      // Handle add child button
      if (target.classList.contains("add-child-btn")) {
        const newTask = {
          text: "New Task",
          start_date: new Date(),
          duration: 3,
          parent: id,
        };
        gantt.createTask(newTask, id);
        return false;
      }

      // Handle delete button
      if (target.classList.contains("delete-btn-hover")) {
        gantt.deleteTask(id);
        return false;
      }

      return true;
    });

    //    INIT   
    gantt.init(ganttContainer.current as HTMLDivElement);

    //    DEMO DATA   
    gantt.parse({
      data: [
        {
          id: 1,
          text: "Project Alpha",
          start_date: "2025-11-01",
          duration: 30,
          open: true,
          owner: "Mike Smith",
        },
        { id: 2, text: "Design", start_date: "2025-11-01", duration: 7, parent: 1, owner: "Mike Smith" },
        { id: 3, text: "Development", start_date: "2025-12-08", duration: 14, parent: 1, owner: "Sam Watson" },
        { id: 4, text: "Testing", start_date: "2025-11-23", duration: 7, parent: 1, owner: "Jane Cooper" },

      ],
    });

    return () => gantt.clearAll();
  }, []);

  //    ACTIONS   
  const addTask = () => gantt.createTask();
  const deleteTask = () => {
    const id = gantt.getSelectedId();
    if (id) gantt.deleteTask(id);
  };
  const undo = () => gantt.undo();
  const redo = () => gantt.redo();
  const zoomIn = () => gantt.ext.zoom.zoomIn();
  const zoomOut = () => gantt.ext.zoom.zoomOut();

  //    CSV   
  const exportCSV = () => {
    const tasks = gantt.serialize().data;
    const csv = Papa.unparse(tasks);
    saveAs(new Blob([csv]), "sheet-to-gannt.csv");
  };

  const importCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res: any) => {
        gantt.clearAll();
        gantt.parse({ data: res.data });
      },
    });
  };

  return (
    <div className="p-4 h-screen bg-white">
      {/* TOOLBAR */}
      <div className="flex justify-between items-center gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={addTask} className="toolbar-btn"><Plus size={16} /> Add</button>
          <button onClick={deleteTask} className="toolbar-btn"><Trash2 size={16} /> Delete</button>
          <button onClick={undo} className="toolbar-btn"><Undo2 size={16} /></button>
          <button onClick={redo} className="toolbar-btn"><Redo2 size={16} /></button>
          <button onClick={zoomIn} className="toolbar-btn"><ZoomIn size={16} /></button>
          <button onClick={zoomOut} className="toolbar-btn"><ZoomOut size={16} /></button>
        </div>

        <div className="flex items-center gap-3">
          <input type="file" hidden ref={fileInputRef} onChange={importCSV} />

          <button onClick={() => fileInputRef.current?.click()} className="toolbar-btn-1">
            <Download size={16} /> Import
          </button>

          <button onClick={exportCSV} className="toolbar-btn-2 ">
            <CiExport size={16} /> Export
          </button>
        </div>
      </div>

      {/* GANTT */}
      <div className="w-full h-[calc(100vh-120px)] border rounded overflow-hidden">
        <div ref={ganttContainer} className="w-full h-full" />
      </div>

      {/* STYLES */}
      <style>
        {`
          ${PROJECT_COLORS.map(
          (c, i) => `
            .task-root-${i} .gantt_task_content {
              background: ${c} !important;
              border-color: ${c} !important;
            }
          `
        ).join("")}
          
          /* Add child button styling */
          .add-child-btn {
            cursor: pointer;
            font-size: 16px;
            opacity: 0.7;
            transition: opacity 0.2s;
          }
          
          .add-child-btn:hover {
            opacity: 1;
          }
          
          /* Delete button - hidden by default, shows on row hover */
          .delete-btn-hover {
            cursor: pointer;
            font-size: 16px;
            opacity: 0;
            transition: opacity 0.2s;
          }
          
          .gantt_row:hover .delete-btn-hover {
            opacity: 0.7;
          }
          
          .delete-btn-hover:hover {
            opacity: 1 !important;
          }
          
          /* Toolbar button styles */
          .toolbar-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .toolbar-btn:hover {
            background: #e5e7eb;
          }
          
          .toolbar-btn-1, .toolbar-btn-2 {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .toolbar-btn-1 {
            background: #3b82f6;
            color: white;
            border: none;
          }
          
          .toolbar-btn-1:hover {
            background: #2563eb;
          }
          
          .toolbar-btn-2 {
            background: #10b981;
            color: white;
            border: none;
          }
          
          .toolbar-btn-2:hover {
            background: #059669;
          }
        `}
      </style>
    </div>
  );
};

export default GanttChart;