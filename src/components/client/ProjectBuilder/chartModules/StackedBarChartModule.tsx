import React, { useState } from 'react';
import ProjectConfiguration, { LegendValue } from '../WidgetForChartModuleOne';
import StackedBarChart from '@/common/Charts/StackedBarChart';

const StackedBarChartModule = () => {
    const [widgetTitle, setWidgetTitle] = useState("My-CSV");

    const [numOfXAxisDataSet, setNumOfXAxisDataSet] = useState<number>(1)
    const [xAxisValues, setXAxisValues] = useState<string[]>([]);
  
    const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(3);
  
    const [legendValues, setLegendValues] = useState<LegendValue[]>([
      { label: "", field: "", color: "#13A490" },
      { label: "", field: "", color: "#35B6EE" },
      { label: "", field: "", color: "#6F78F9" },
    ]);
    const [startingRange, setStartingRange] = useState<number>(0); //for y axis
    const [endingRange, setEndingRange] = useState<number>(100); // for y axis
  
    const minXaxisField = 1;
    const maxXaxisField = 7;
    const handleSetNumOfXAxisDataSet = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (isNaN(value)) {
        setNumOfXAxisDataSet(1);
      }
      else if (value >= minXaxisField && value <= maxXaxisField) {
        setNumOfXAxisDataSet(value);
      } else {
        setNumOfXAxisDataSet(1);
        alert(`Please enter a number between ${minXaxisField} and ${maxXaxisField}`);
      }
  
      setXAxisValues((prev) => {
        const updated = [...prev];
        // Adding empty values if increased
        while (updated.length < value) {
          updated.push("");
        }
        // Removing extra values if decreased
        return updated.slice(0, value);
      });
    }
  
    const handleXAxisValueChange = (
      index: number,
      value: string
    ) => {
      setXAxisValues((prev) => {
        const updated = [...prev];
        updated[index] = value;
        return updated;
      });
      console.log("parant x values: ",xAxisValues);
    };
    return (
        <div className="flex gap-3">
            <StackedBarChart
                widgetTitle={widgetTitle}
                xAxisValues={xAxisValues}
                legendValues={legendValues}
                numOfLegendDataSet={numOfLegendDataSet}
                startingRange={startingRange}
                endingRange={endingRange}
            />
            <ProjectConfiguration
                widgedName="Stack Bar Chart"
                widgetTitle={widgetTitle}
                setWidgetTitle={setWidgetTitle}
                numOfXAxisDataSet={numOfXAxisDataSet}
                handleSetNumOfXAxisDataSet={handleSetNumOfXAxisDataSet}
                xAxisValues={xAxisValues}
                handleXAxisValueChange={handleXAxisValueChange}
                numOfLegendDataSet={numOfLegendDataSet}
                setNumOfLegendDataSet={setNumOfLegendDataSet}
                legendValues={legendValues}
                setLegendValues={setLegendValues}
                startingRange={startingRange}
                setStartingRange={setStartingRange}
                endingRange={endingRange}
                setEndingRange={setEndingRange}
            />
        </div>
    );
};

export default StackedBarChartModule;