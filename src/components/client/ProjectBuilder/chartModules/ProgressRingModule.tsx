// import { useState } from "react";
// import { LegendValue } from "../WidgetForChartModuleOne";
// import WidgetForChartModuleTwo from "../WidgetForChartModuleTwo";
// import ProgressRingChart from "@/common/Charts/ProgressRingChart";

// const ProgressRingModule = () => {
//   const [widgetTitle, setWidgetTitle] = useState("My-CSV");
//   const [showWidget, setShowWidget] = useState(false);

//   const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(3);

//   const [legendValues, setLegendValues] = useState<LegendValue[]>([
//     { label: "", field: "", color: "#13A490" },
//     { label: "", field: "", color: "#35B6EE" },
//     { label: "", field: "", color: "#6F78F9" },
//   ]);

//   const [startingRange, setStartingRange] = useState<number>(0);
//   const [endingRange, setEndingRange] = useState<number>(100);

//   /* SAME PATTERN AS LineChartModule */
//   const handleToggleWidget = () => {
//     setShowWidget(!showWidget);
//   };

//   const handleCloseWidget = () => {
//     setShowWidget(false);
//   };

//   return (
//     <div className="flex gap-3">
//       {/* CHART */}
//       <ProgressRingChart
//         widgetTitle={widgetTitle}
//         legendValues={legendValues}
//         startingRange={startingRange}
//         endingRange={endingRange}
//         onToggleWidget={handleToggleWidget}
//       />

//       {/* CONFIG PANEL */}
//       {showWidget && (
//         <WidgetForChartModuleTwo
//           widgedName="Progress Ring Chart"
//           widgetTitle={widgetTitle}
//           widgetCategory="PIE"
//           setWidgetTitle={setWidgetTitle}
//           numOfLegendDataSet={numOfLegendDataSet}
//           setNumOfLegendDataSet={setNumOfLegendDataSet}
//           legendValues={legendValues}
//           setLegendValues={setLegendValues}
//           startingRange={startingRange}
//           setStartingRange={setStartingRange}
//           endingRange={endingRange}
//           setEndingRange={setEndingRange}
//           onClose={handleCloseWidget}
//         />
//       )}
//     </div>
//   );
// };

// export default ProgressRingModule;
