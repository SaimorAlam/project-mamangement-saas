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
  Search,
} from "lucide-react";
import { CiExport } from "react-icons/ci";
import { toast } from "sonner";

/*   COLOR POOL FOR ROOT PROJECTS   */
const PROJECT_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#ec4899",
  "#8b5cf6",
  "#f97316",
];

function extractColumnTitle(label: string) {
  if (!label) return "";

  const div = document.createElement("div");
  div.innerHTML = label;

  const title = div.querySelector(".col-title");
  if (title) return title.textContent || "";

  return div.textContent || "";
}

function highlightText(text: any, query: string) {
  if (!text) return "";
  if (!query) return String(text);

  const safe = String(text);
  const q = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${q})`, "gi");

  return safe.replace(regex, `<span class="gantt-search-hit">$1</span>`);
}

const GanttChart = () => {
  const ganttContainer = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTextRef = useRef<string>("");
  const resizingRef = useRef<{
    name: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  /*   HELPER FOR RESIZABLE LABELS   */
  const wrapLabel = (text: string, name: string, isCustom = false) => {
    return `
      <div class="col-header-wrap" data-column="${name}">
        <span class="col-title">${text}</span>
        ${isCustom ? `<span class="delete-col-btn" data-col="${name}">x</span>` : ""}
        <div class="column-resizer-handle" data-column="${name}"></div>
      </div>
    `;
  };

  useEffect(() => {
    gantt.clearAll();

    gantt.plugins({
      undo: true,
      marker: true,
      tooltip: true,
    });

    /*    COLUMN TOOLS    */

    function renameColumn(colName: string) {
      const col = gantt.config.columns.find((c: any) => c.name === colName);
      if (!col) return;

      const newName = prompt("Enter new column name", "");
      if (!newName) return;

      if (colName.startsWith("custom_")) {
        col.label = wrapLabel(newName, colName, true);
      } else {
        col.label = wrapLabel(newName, colName, false);
      }

      gantt.render();
    }

    function deleteColumn(colName: string) {
      if (!colName.startsWith("custom_")) {
        toast.info("Only custom columns can be deleted.");
        return;
      }

      gantt.config.columns = gantt.config.columns.filter(
        (c: any) => c.name !== colName,
      );

      gantt.render();
    }

    /*    CORE CONFIG    */

    gantt.config.date_format = "%Y-%m-%d";
    gantt.config.drag_progress = true;
    gantt.config.drag_resize = true;
    gantt.config.drag_move = true;
    gantt.config.grid_resize = true;
    gantt.config.resize_grid_columns = true;
    gantt.config.fit_tasks = false; // Disable to allow horizontal scroll
    gantt.config.order_branch = true;
    gantt.config.order_branch_free = true;
    gantt.config.open_tree_initially = true;

    /*    LAYOUT FOR SCROLLBARS    */
    gantt.config.layout = {
      css: "gantt_container",
      rows: [
        {
          cols: [
            {
              view: "grid",
              id: "grid",
              scrollX: "gridScroll",
              scrollY: "verticalScroll",
            },
            { resizer: true, width: 1 },
            {
              view: "timeline",
              id: "timeline",
              scrollX: "timelineScroll",
              scrollY: "verticalScroll",
            },
            {
              view: "scrollbar",
              id: "verticalScroll",
            },
          ],
        },
        {
          cols: [
            { view: "scrollbar", id: "gridScroll", group: "horizontal" },
            { resizer: true, width: 1 },
            { view: "scrollbar", id: "timelineScroll", group: "horizontal" },
          ],
        },
      ],
    };

    /*    LIGHTBOX    */

    gantt.attachEvent("onTaskDblClick", function (id: any) {
      gantt.showLightbox(id);
      return false;
    });

    gantt.attachEvent("onAfterTaskUpdate", function (id: any) {
      const task = gantt.getTask(id);
      if (task.parent) {
        expandParentIfNeeded(task.parent);
      }
    });

    gantt.attachEvent("onAfterTaskAdd", function (id: any) {
      const task = gantt.getTask(id);
      if (task.parent) {
        expandParentIfNeeded(task.parent);
      }
    });

    gantt.attachEvent("onAfterTaskDelete", function (_id: any, task: any) {
      if (task && task.parent) {
        expandParentIfNeeded(task.parent);
      }
    });

    gantt.attachEvent("onBeforeTaskDisplay", function (_id: any, task: any) {
      const query = searchTextRef.current.trim().toLowerCase();

      if (!query) return true;

      // Search in ALL fields including custom columns
      const columns = gantt.config.columns;

      for (const col of columns) {
        const field = col.name;
        if (!field || field === "add" || field === "all") continue;

        const value = task[field];
        if (!value) continue;

        if (String(value).toLowerCase().includes(query)) {
          return true;
        }
      }

      return false;
    });

    gantt.config.lightbox.sections = [
      {
        name: "text",
        height: 38,
        map_to: "text",
        type: "textarea",
        focus: true,
      },
      { name: "owner", height: 30, map_to: "owner", type: "textarea" },
      { name: "time", type: "duration", map_to: "auto" },
    ];

    gantt.config.editable = true;

    /*    COLUMNS    */

    gantt.config.columns = [
      {
        name: "all",
        label: wrapLabel("#", "all"),
        align: "left",
        width: 100,
        template: (task: any) => {
          const idx = gantt.getGlobalTaskIndex(task.id) + 1;
          return `
            <div class="all-col-content">
              <span class="row-index">${idx}</span>
              <div class="row-icons">
                <span class="figma-icon">📎</span>
                <span class="figma-icon">💬</span>
                <span class="figma-icon">📊</span>
              </div>
            </div>
          `;
        },
      },
      {
        name: "text",
        label: wrapLabel("Task name", "text"),
        tree: true,
        width: 280,
        template: (task: any) => {
          let colorBar = "";
          if (task.rootColor !== undefined) {
            const color =
              PROJECT_COLORS[task.rootColor % PROJECT_COLORS.length];
            colorBar = `<div class="row-color-bar" style="background-color: ${color}"></div>`;
          }
          const highlighted = highlightText(
            task.text,
            searchTextRef.current.trim(),
          );
          return `<div class="task-name-wrapper">${colorBar}<span class="task-name-text">${highlighted}</span></div>`;
        },
      },
      {
        name: "duration",
        label: wrapLabel("Duration", "duration"),
        align: "center",
        width: 80,
        template: (task: any) => (task.duration || 0) + " Days",
      },
      {
        name: "start_date",
        label: wrapLabel("Start", "start_date"),
        align: "center",
        width: 90,
        template: (task: any) =>
          task.start_date ? gantt.templates.date_grid(task.start_date) : "",
      },
      {
        name: "end_date",
        label: wrapLabel("Finish", "end_date"),
        align: "center",
        width: 90,
        template: (task: any) =>
          task.end_date ? gantt.templates.date_grid(task.end_date) : "",
      },
      {
        name: "owner",
        label: wrapLabel("Assigned", "owner"),
        align: "center",
        width: 120,
        template: (task: any) => task.owner || "Unassigned",
      },
      {
        name: "add",
        label: "",
        width: 44,
        template: () => `<span class="add-child-btn"></span>`,
      },
    ];

    // Format for date columns in grid
    gantt.templates.date_grid = (date: Date) => {
      const d = date.getDate();
      const m = date.getMonth() + 1;
      const y = date.getFullYear().toString().slice(-2);
      return `${m}/${d}/${y}`;
    };

    /*    ZOOM    */

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

    /*    MARKER    */

    gantt.addMarker({
      start_date: new Date(),
      css: "today",
      text: "Today",
    });

    /*    COLORS    */

    gantt.templates.task_class = function (_start: any, _end: any, task: any) {
      if (task.rootColor !== undefined) return "task-root-" + task.rootColor;
      return "";
    };

    gantt.attachEvent("onTaskCreated", function (task: any) {
      if (!task.parent || task.parent === 0) {
        const index = gantt.getTaskCount() % PROJECT_COLORS.length;
        task.rootColor = index;
      } else {
        const parent = gantt.getTask(task.parent);
        task.rootColor = parent.rootColor;
      }
      return true;
    });

    gantt.attachEvent("onBeforeTaskAdd", function (_id: any, task: any) {
      if (task.parent) {
        const parent = gantt.getTask(task.parent);
        task.rootColor = parent.rootColor;
      } else if (task.rootColor === undefined) {
        task.rootColor = gantt.getTaskCount() % PROJECT_COLORS.length;
      }
      return true;
    });

    // Color assignment for parsed data
    gantt.attachEvent("onParse", function () {
      gantt.eachTask((task: any) => {
        if (!task.parent || task.parent === 0) {
          if (task.rootColor === undefined) {
            task.rootColor =
              gantt.getGlobalTaskIndex(task.id) % PROJECT_COLORS.length;
          }
        } else {
          const parent = gantt.getTask(task.parent);
          task.rootColor = parent.rootColor;
        }
      });
    });

    /*    GRID BUTTONS    */

    gantt.attachEvent("onGridClick", function (id: any, e: any) {
      const target = e.target as HTMLElement;

      if (target.classList.contains("add-child-btn")) {
        gantt.createTask(
          {
            text: "New Task",
            start_date: new Date(),
            duration: 3,
            parent: id,
          },
          id,
        );
        return false;
      }

      return true;
    });

    /*    HEADER CLICK    */
    gantt.attachEvent("onGridHeaderClick", function (name: string, e: any) {
      const target = e.target as HTMLElement;

      // Case 1: Click on delete button
      if (target.classList.contains("delete-col-btn")) {
        const colName = target.dataset.col;
        if (colName) deleteColumn(colName);
        return false;
      }

      // Case 2: Click on custom column title
      if (target.classList.contains("col-title")) {
        const parent = target.closest(".col-header");
        const delBtn = parent?.querySelector(".delete-col-btn") as HTMLElement;
        const colName = delBtn?.dataset.col;
        if (colName) renameColumn(colName);
        return false;
      }

      // Case 3: Click on normal column header (Task name, Duration, etc)
      if (name) {
        renameColumn(name);
        return false;
      }

      return true;
    });

    /*    PARENT AUTO SYNC LOGIC    */

    /*    PARENT EXPAND ONLY LOGIC (NO SHRINK)    */

    function expandParentIfNeeded(parentId: any) {
      if (!parentId || parentId === 0) return;

      const parent = gantt.getTask(parentId);
      const children = gantt.getChildren(parentId);

      if (!children || !children.length) return;

      let newStart = new Date(parent.start_date);
      let newEnd = new Date(parent.end_date);

      let changed = false;

      children.forEach((cid: any) => {
        const child = gantt.getTask(cid);

        // Expand to left if needed
        if (child.start_date < newStart) {
          newStart = new Date(child.start_date);
          changed = true;
        }

        // Expand to right if needed
        if (child.end_date > newEnd) {
          newEnd = new Date(child.end_date);
          changed = true;
        }
      });

      if (changed) {
        parent.start_date = newStart;
        parent.end_date = newEnd;
        parent.duration = gantt.calculateDuration(newStart, newEnd);

        gantt.updateTask(parent.id);

        // Recursively expand upper levels
        if (parent.parent) {
          expandParentIfNeeded(parent.parent);
        }
      }
    }

    // Highlight normal columns
    gantt.templates.grid_cell = function (task: any, column: any) {
      const value = task[column.name];
      return highlightText(value, searchTextRef.current.trim());
    };

    // Highlight tree column (task name)
    gantt.templates.tree_cell = function (task: any, column: any) {
      const value = task[column.name];
      return highlightText(value, searchTextRef.current.trim());
    };

    /*    INIT    */

    gantt.init(ganttContainer.current as HTMLDivElement);

    /*    CUSTOM RESIZE LISTENERS    */
    const container = ganttContainer.current;
    if (container) {
      const onMouseDown = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        console.log("Gantt: mousedown on", target.className);

        // 1. Check for Column Header Resizer
        if (target.classList.contains("column-resizer-handle")) {
          e.preventDefault();
          e.stopPropagation();
          const colName = target.dataset.column;
          const col = gantt.config.columns.find((c: any) => c.name === colName);
          if (col) {
            resizingRef.current = {
              name: colName as string,
              startX: e.pageX,
              startWidth: col.width || 0,
            };
            document.body.style.cursor = "col-resize";
            console.log("Gantt: Started resizing column", colName);
            return;
          }
        }

        // 2. Check for Grid/Table boundary resizer (between table and chart)
        const grid = container.querySelector(".gantt_grid");
        if (grid) {
          const rect = grid.getBoundingClientRect();
          const xInGrid = e.clientX - rect.left;

          // Debugging info
          console.log(
            "Gantt: Click X relative to grid:",
            xInGrid,
            "Grid Rect Width:",
            rect.width,
          );

          // If click is within 15px of the right edge of the grid
          if (Math.abs(xInGrid - rect.width) <= 20) {
            console.log("Gantt: Started resizing Grid boundary");
            e.preventDefault();
            resizingRef.current = {
              name: "GRID_WIDTH_RESIZE",
              startX: e.pageX,
              startWidth: gantt.config.grid_width || rect.width,
            };
            document.body.style.cursor = "col-resize";
          }
        }
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!resizingRef.current) {
          // Visual feedback: change cursor if near grid boundary
          const grid = container.querySelector(".gantt_grid");
          if (grid) {
            const rect = grid.getBoundingClientRect();
            const xInGrid = e.clientX - rect.left;
            if (Math.abs(xInGrid - rect.width) <= 15) {
              container.style.cursor = "col-resize";
            } else {
              container.style.cursor = "";
            }
          }
          return;
        }

        const { name, startX, startWidth } = resizingRef.current;
        const diff = e.pageX - startX;

        if (name === "GRID_WIDTH_RESIZE") {
          const newWidth = Math.max(100, startWidth + diff);
          gantt.config.grid_width = newWidth;
          gantt.render(); // Full render to ensure scrollbars update
        } else {
          const col = gantt.config.columns.find((c: any) => c.name === name);
          if (col) {
            col.width = Math.max(30, startWidth + diff);
            gantt.render();
          }
        }
      };

      const onMouseUp = () => {
        if (resizingRef.current) {
          resizingRef.current = null;
          document.body.style.cursor = "";
        }
      };

      container.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);

      (container as any)._cleanupResize = () => {
        container.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }

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

    return () => {
      gantt.clearAll();
      if ((container as any)._cleanupResize)
        (container as any)._cleanupResize();
    };
  }, []);

  /*    ACTIONS    */

  const addTask = () => gantt.createTask();

  const deleteTask = () => {
    const id = gantt.getSelectedId();
    if (id) gantt.deleteTask(id);
  };

  const undo = () => gantt.undo();
  const redo = () => gantt.redo();
  const zoomIn = () => gantt.ext.zoom.zoomIn();
  const zoomOut = () => gantt.ext.zoom.zoomOut();

  /*    CSV    */
  const exportCSV = () => {
    const tasks = gantt.serialize().data;

    const baseFields = [
      "text",
      "start_date",
      "duration",
      "end_date",
      "progress",
      "owner",
    ];

    // All visible columns
    const columns = gantt.config.columns;

    // Build field list: base + custom
    const customFields = columns
      .map((c: any) => c.name)
      .filter((n: string) => n.startsWith("custom_"));

    const allowedFields = [...baseFields, ...customFields];

    const exportData = tasks.map((task: any) => {
      const row: any = {};

      allowedFields.forEach((field) => {
        let value = task[field];

        if (
          (field === "start_date" || field === "end_date") &&
          value instanceof Date
        ) {
          value = gantt.templates.xml_format(value);
        }

        // Find column config
        const col = columns.find((c: any) => c.name === field);

        // Extract clean header text
        const header = col ? extractColumnTitle(col.label || field) : field;

        row[header] = value ?? "";
      });

      return row;
    });

    const csv = Papa.unparse(exportData);
    saveAs(new Blob([csv]), "sheet-to-gantt.csv");
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

  function addCustomColumn() {
    const id = Date.now();
    const colName = "custom_" + id;

    gantt.config.columns.splice(gantt.config.columns.length - 1, 0, {
      name: colName,
      label: wrapLabel("Custom", colName, true),
      width: 140,
      resize: true,
      align: "center",
      template: (task: any) => task[colName] || "",
      editor: { type: "text", map_to: colName },
    });

    gantt.render();
  }

  /*    UI    */

  return (
    <div className="p-4 h-screen bg-white">
      <div className="flex justify-between gap-2 mb-3 flex-wrap">
        <div className="flex gap-3 items-center">
          <button onClick={addTask} className="toolbar-btn">
            <Plus size={16} /> Add Root Task
          </button>

          <button onClick={addCustomColumn} className="toolbar-btn">
            <Plus size={16} /> Add Column
          </button>

          <button onClick={deleteTask} className="toolbar-btn">
            <Trash2 size={16} /> Delete a Row
          </button>

          <button onClick={undo} className="toolbar-btn">
            <Undo2 size={16} />
          </button>

          <button onClick={redo} className="toolbar-btn">
            <Redo2 size={16} />
          </button>

          <button onClick={zoomIn} className="toolbar-btn">
            <ZoomIn size={16} />
          </button>

          <button onClick={zoomOut} className="toolbar-btn">
            <ZoomOut size={16} />
          </button>
        </div>

        <div className="flex gap-3 items-center">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>

            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none  focus:border-blue-500 focus:ring-1  focus:ring-blue-500/30 transition-colors
    "
              onChange={(e) => {
                searchTextRef.current = e.target.value;
                gantt.render();
              }}
            />
          </div>

          <input type="file" hidden ref={fileInputRef} onChange={importCSV} />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="toolbar-btn"
          >
            <Download size={16} /> Import
          </button>

          <button
            onClick={exportCSV}
            className="toolbar-btn bg-blue-500! text-white! hover:bg-blue-600!"
          >
            <CiExport size={16} /> Export
          </button>
        </div>
      </div>

      <div className="w-full h-full rounded overflow-hidden">
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
            `,
          ).join("")}

          .add-child-btn { cursor: pointer; }

          .col-header-wrap {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
          }

          .column-resizer-handle {
            position: absolute;
            right: 0;
            top: 0;
            width: 8px;
            height: 100%;
            cursor: col-resize;
            z-index: 50;
          }

          .column-resizer-handle:hover {
            background: rgba(59, 130, 246, 0.5);
          }

          .gantt_grid {
             border-right: 5px solid transparent !important;
             transition: border-right-color 0.2s;
          }

          .gantt_grid:hover {
             border-right: 5px solid rgba(59, 130, 246, 0.4) !important;
          }

          /* Match the divider color when resizing */
          .gantt_resizer {
            background-color: rgba(59, 130, 246, 0.5) !important;
          }

          .delete-col-btn {
            cursor: pointer;
            color: red;
            font-weight: bold;
            margin-left: 6px;
          }

          /* Figma specific styling */
          .all-col-content {
            display: flex;
            align-items: center;
            gap: 10px;
            padding-left: 5px;
          }
          .row-index {
            min-width: 20px;
            font-weight: 500;
          }
          .row-icons {
            display: flex;
            gap: 4px;
            opacity: 0.6;
          }
          .figma-icon {
            font-size: 14px;
            cursor: pointer;
          }
          .task-name-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            height: 100%;
            padding-left: 5px;
            overflow: visible;
          }
          .row-color-bar {
            position: absolute;
            left: -15px;
            top: 4px;
            bottom: 4px;
            width: 4px;
            border-radius: 2px;
            z-index: 10;
          }
          .task-name-text {
            font-weight: 500;
            color: #374151;
            white-space: nowrap;
          }
          .gantt_tree_content {
             padding-left: 20px !important;
             overflow: visible !important;
          }

          /* Ensure horizontal scrollbars are visible and styled modernly */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }

          .gantt_layout_cell.gantt_hor_scroll {
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
          }
        `}
      </style>
    </div>
  );
};

export default GanttChart;
