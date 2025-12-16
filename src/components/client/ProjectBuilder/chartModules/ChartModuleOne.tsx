import React, { useState } from 'react';
import ProjectConfiguration, { LegendValue } from '../ProjectConfiguration';
import StackedBarChart from '@/common/Charts/StackedBarChart';
import AreaChart from '@/common/Charts/AreaChart';
import MultiAxisLineChart from '@/common/Charts/LineChart';

const ChartModuleOne = ({ chartName }: { chartName: string }) => {
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
        console.log("parant x values: ", xAxisValues);
    };
    return (
        <div className="flex gap-3">
            {(() => {
                if (chartName === "bar-chart") {
                    return (
                        <StackedBarChart
                            widgetTitle={widgetTitle}
                            xAxisValues={xAxisValues}
                            legendValues={legendValues}
                            numOfLegendDataSet={numOfLegendDataSet}
                            startingRange={startingRange}
                            endingRange={endingRange}
                        />
                    );
                } else if (chartName === "area-chart") {
                    return (
                        <AreaChart
                            widgetTitle={widgetTitle}
                            xAxisValues={xAxisValues}
                            legendValues={legendValues}
                            startingRange={startingRange}
                            endingRange={endingRange}
                        />
                    );
                } else if (chartName === "line-chart") {
                    return (
                        <MultiAxisLineChart
                            widgetTitle={widgetTitle}
                            xAxisValues={xAxisValues}
                            legendValues={legendValues}
                            startingRange={startingRange}
                            endingRange={endingRange}
                        />
                    )
                }
                return null;
            })()}

            <ProjectConfiguration
                widgedName={chartName === "stacked-bar-chart" ? "Stacked Bar Chart" : 
                    chartName === "area-chart" ? "Area Chart" : 
                    chartName === "line-chart" ? "Line Chart" : 
                    ""}
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

export default ChartModuleOne;