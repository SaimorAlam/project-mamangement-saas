/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";

declare const gantt: any;

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

/*   COLOR POOL FOR ROOT PROJECTS   */
const PROJECT_COLORS = [
  "#22c55e",
  "#eab308",
  "#3b82f6",
  "#ec4899",
  "#8b5cf6",
  "#f97316",
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

    gantt.config.layout = {
  css: "gantt_container",
  cols: [
    {
      width: 420,     // initial left width
      min_width: 250, // minimum left size
      rows: [
        { view: "grid", scrollX: "gridScroll", scrollY: "scrollVer" },
        { view: "scrollbar", id: "gridScroll", group: "horizontal" }
      ]
    },
    { resizer: true, width: 1 },   // 👈 THIS IS THE DRAG HANDLE
    {
      rows: [
        { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
        { view: "scrollbar", id: "scrollHor", group: "horizontal" }
      ]
    },
    { view: "scrollbar", id: "scrollVer" }
  ]
};


    //    CORE CONFIG   
    gantt.config.date_format = "%Y-%m-%d";
    gantt.config.drag_progress = true;
    gantt.config.drag_resize = true;
    gantt.config.drag_move = true;
    // gantt.config.grid_resize = true;
    gantt.config.fit_tasks = true;
    gantt.config.order_branch = true;
    gantt.config.order_branch_free = true;
    gantt.config.autosize = "y";
    gantt.config.open_tree_initially = true;

    //    LIGHTBOX   
    gantt.attachEvent("onTaskDblClick", function (id:any) {
      gantt.showLightbox(id);
      return false;
    });

    gantt.config.details_on_dblclick = true;
    gantt.config.details_on_create = true;

    gantt.config.lightbox.sections = [
      { name: "text", height: 38, map_to: "text", type: "textarea", focus: true },
      { name: "owner", height: 30, map_to: "owner", type: "textarea" },
      { name: "time", type: "duration", map_to: "auto" },
    ];

    gantt.config.editable = false;

    //    COLUMNS   
    gantt.config.columns = [
      {
        name: "all",
        label: "All",
        align: "center",
        width: 70,
        template: (task:any) => gantt.getGlobalTaskIndex(task.id) + 1,
      },
      {
        name: "text",
        label: "Task name",
        tree: true,
        width: 260,
        resize: true,
      },
      { name: "duration", label: "Duration", align: "center", width: 90 },
      { name: "start_date", label: "Start Date", align: "center", width: 110 },
      {
        name: "end_date",
        label: "Finished Date",
        align: "center",
        width: 110,
        template: (task:any) =>
          task.end_date ? gantt.templates.date_grid(task.end_date) : "",
      },
      { name: "owner", label: "Assigned", align: "center", width: 130 },
      {
        name: "add",
        label: "",
        width: 44,
        template: () => `<span class="add-child-btn">+</span>`,
      },
      {
        name: "delete",
        label: "",
        width: 44,
        template: () => `<span class="delete-btn-hover">-</span>`,
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
            { unit: "day", step: 1, format: "%d" },
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
    gantt.templates.task_class = function (_start:any, _end:any, task:any) {
      if (task.rootColor !== undefined) return "task-root-" + task.rootColor;
      return "";
    };

    // Assign color to root projects
    gantt.attachEvent("onTaskCreated", function (task:any) {
      if (!task.parent || task.parent === 0) {
        const index = gantt.getTaskCount() % PROJECT_COLORS.length;
        task.rootColor = index;
      }
      return true;
    });

    // Inherit parent color
    gantt.attachEvent("onBeforeTaskAdd", function (_id:any, task:any) {
      if (task.parent) {
        const parent = gantt.getTask(task.parent);
        task.rootColor = parent.rootColor;
      }
      return true;
    });

    //    PARENT AUTO-EXPAND LOGIC   
    function enforceParentRange(parentId: any) {
      if (!parentId || parentId === 0) return;

      const parent = gantt.getTask(parentId);
      const children = gantt.getChildren(parentId);
      if (!children.length) return;

      let minStart = parent.start_date;
      let maxEnd = parent.end_date;

      children.forEach((cid: any) => {
        const child = gantt.getTask(cid);
        if (child.start_date < minStart) minStart = child.start_date;
        if (child.end_date > maxEnd) maxEnd = child.end_date;
      });

      let changed = false;

      if (minStart < parent.start_date) {
        parent.start_date = minStart;
        changed = true;
      }

      if (maxEnd > parent.end_date) {
        parent.end_date = maxEnd;
        parent.duration = gantt.calculateDuration(
          parent.start_date,
          parent.end_date
        );
        changed = true;
      }

      if (changed) {
        gantt.updateTask(parent.id);
        enforceParentRange(parent.parent); // recursive
      }
    }

    gantt.attachEvent("onAfterTaskUpdate", function (id:any) {
      const task = gantt.getTask(id);
      if (task.parent) enforceParentRange(task.parent);
    });

    gantt.attachEvent("onAfterTaskAdd", function (id:any) {
      const task = gantt.getTask(id);
      if (task.parent) enforceParentRange(task.parent);
    });

    gantt.attachEvent("onAfterTaskDelete", function (_id:any, task:any) {
      if (task.parent) enforceParentRange(task.parent);
    });

    //    GRID BUTTONS   
    (gantt as any).attachEvent("onGridClick", function (id: any, e: any) {
      const target = e.target as HTMLElement;

      if (target.classList.contains("add-child-btn")) {
        gantt.createTask(
          {
            text: "New Task",
            start_date: new Date(),
            duration: 3,
            parent: id,
          },
          id
        );
        return false;
      }

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
          text: "Project A",
          start_date: "2025-06-02",
          duration: 5,
          open: true,
        },
        {
          id: 2,
          text: "Child 1",
          start_date: "2025-06-02",
          duration: 3,
          parent: 1,
        },
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
          <button onClick={() => fileInputRef.current?.click()} className="toolbar-btn">
            <Download size={16} /> Import
          </button>
          <button onClick={exportCSV} className="toolbar-btn">
            <CiExport /> Export
          </button>
        </div>
      </div>

      <div className="w-full h-[calc(100vh-120px)] border rounded overflow-hidden">
        <div ref={ganttContainer} className="w-full h-full" />
      </div>

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

          .add-child-btn { cursor: pointer; }
          .delete-btn-hover { cursor: pointer; opacity: 0; }
          .gantt_row:hover .delete-btn-hover { opacity: 1; }
        `}
      </style>
    </div>
  );
};

export default GanttChart;
