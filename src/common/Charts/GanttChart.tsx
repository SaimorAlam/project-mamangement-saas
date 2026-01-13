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

    /*    COLUMN TOOLS    */

    function renameColumn(colName: string) {
      const col = gantt.config.columns.find((c: any) => c.name === colName);
      if (!col) return;

      const newName = prompt("Enter new column name", "");
      if (!newName) return;

      if (colName.startsWith("custom_")) {
        col.label = `
      <div class="col-header">
        <span class="col-title">${newName}</span>
        <span class="delete-col-btn" data-col="${colName}">✖</span>
      </div>
    `;
      } else {
        // System column: just change text
        col.label = newName;
      }

      gantt.render();
    }


    function deleteColumn(colName: string) {
      if (!colName.startsWith("custom_")) {
        alert("Only custom columns can be deleted.");
        return;
      }

      gantt.config.columns = gantt.config.columns.filter(
        (c: any) => c.name !== colName
      );

      gantt.render();
    }

    /*    CORE CONFIG    */

    gantt.config.date_format = "%Y-%m-%d";
    gantt.config.drag_progress = true;
    gantt.config.drag_resize = true;
    gantt.config.drag_move = true;
    gantt.config.grid_resize = true;
    gantt.config.fit_tasks = true;
    gantt.config.order_branch = true;
    gantt.config.order_branch_free = true;
    gantt.config.autosize = "y";
    gantt.config.open_tree_initially = true;

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


    gantt.config.lightbox.sections = [
      { name: "text", height: 38, map_to: "text", type: "textarea", focus: true },
      { name: "owner", height: 30, map_to: "owner", type: "textarea" },
      { name: "time", type: "duration", map_to: "auto" },
    ];

    gantt.config.editable = true;

    /*    COLUMNS    */

    gantt.config.columns = [
      {
        name: "all",
        label: "All",
        align: "center",
        width: 40,
        template: (task: any) => gantt.getGlobalTaskIndex(task.id) + 1,
      },
      {
        name: "text",
        label: "Task name",
        tree: true,
        width: 260,
        resize: true,
        editor: { type: "text", map_to: "text" },
      },
      {
        name: "duration",
        label: "Duration",
        align: "center",
        width: 90,
        editor: { type: "number", map_to: "duration" },
      },
      {
        name: "start_date",
        label: "Start Date",
        align: "center",
        width: 110,
        editor: { type: "date", map_to: "start_date" },
      },
      {
        name: "end_date",
        label: "Finished Date",
        align: "center",
        width: 110,
        template: (task: any) =>
          task.end_date ? gantt.templates.date_grid(task.end_date) : "",
      },
      {
        name: "owner",
        label: "Assigned",
        align: "center",
        width: 130,
        editor: { type: "text", map_to: "owner" },
      },
      {
        name: "add",
        label: "",
        width: 44,
        template: () => `<span class="add-child-btn"></span>`,
      },
    ];

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
      }
      return true;
    });

    gantt.attachEvent("onBeforeTaskAdd", function (_id: any, task: any) {
      if (task.parent) {
        const parent = gantt.getTask(task.parent);
        task.rootColor = parent.rootColor;
      }
      return true;
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
          id
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



    /*    INIT    */

    gantt.init(ganttContainer.current as HTMLDivElement);

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
      label: `
  <div class="col-header pl-4">
    <span class="col-title">Custom</span>
    <span class="delete-col-btn" data-col="${colName}" title="Delete this column">✖</span>
  </div>
`,
      width: 140,
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
          <input type="file" hidden ref={fileInputRef} onChange={importCSV} />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="toolbar-btn"
          >
            <Download size={16} /> Import
          </button>

          <button onClick={exportCSV} className="toolbar-btn bg-blue-500! text-white! hover:bg-blue-600!">
            <CiExport size={16} /> Export
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

          .col-header {
            display: flex;
            justify-content: space-center;
            align-items: center;
          }

          .delete-col-btn {
            cursor: pointer;
            color: red;
            font-weight: bold;
            margin-left: 6px;
          }
        `}
      </style>
    </div>
  );
};

export default GanttChart;
