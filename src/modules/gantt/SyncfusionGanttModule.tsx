// import {
//   GanttComponent,
//   ColumnsDirective,
//   ColumnDirective,
//   Inject,
//   Edit,
//   Selection,
//   Toolbar,
//   DayMarkers,
//   Resize,
//   Sort,
//   Filter,
// } from "@syncfusion/ej2-react-gantt";

// import { ganttData } from "./sfDemoData";

// const SyncfusionGanttModule = () => {
//   const taskFields = {
//     id: "TaskID",
//     name: "TaskName",
//     startDate: "StartDate",
//     duration: "Duration",
//     progress: "Progress",
//     child: "subtasks",
//   };

//   const editSettings = {
//     allowEditing: true,
//     allowAdding: true,
//     allowDeleting: true,
//     allowTaskbarEditing: true,
//     showDeleteConfirmDialog: true,
//     mode: "Auto",
//   };

//   const toolbarOptions = [
//     "Add",
//     "Edit",
//     "Update",
//     "Delete",
//     "Cancel",
//     "ExpandAll",
//     "CollapseAll",
//     "ZoomIn",
//     "ZoomOut",
//     "ZoomToFit",
//     "Search",
//   ];

//   return (
//     <div style={{ height: "100vh", width: "100%", background: "#fff", padding: 12 }}>
//       <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>
//         Project Planning (Excel-like Gantt)
//       </h2>

//       <GanttComponent
//         id="GanttChart"
//         dataSource={ganttData}
//         taskFields={taskFields}
//         height="90vh"
//         treeColumnIndex={1}
//         allowSorting={true}
//         allowFiltering={true}
//         allowResizing={true}
//         highlightWeekends={true}
//         enableContextMenu={true}
//         editSettings={editSettings}
//         toolbar={toolbarOptions}
//         gridLines="Both"
//       >
//         <ColumnsDirective>
//           <ColumnDirective field="TaskID" headerText="ID" width="60" />
//           <ColumnDirective field="TaskName" headerText="Task Name" width="250" />
//           <ColumnDirective field="StartDate" headerText="Start Date" />
//           <ColumnDirective field="Duration" headerText="Duration" />
//           <ColumnDirective field="Progress" headerText="Progress" />
//         </ColumnsDirective>

//         <Inject
//           services={[
//             Edit,
//             Selection,
//             Toolbar,
//             DayMarkers,
//             Resize,
//             Sort,
//             Filter,
//           ]}
//         />
//       </GanttComponent>
//     </div>
//   );
// };

// export default SyncfusionGanttModule;
