// this module i created for Pie Chart, Progress Ring (Doughnut) Chart 
// means this this a common widget module which will work for these  charts
import { useState } from 'react';
import { LegendValue } from '../WidgetForChartModuleOne';
import WidgetForChartModuleTwo from '../WidgetForChartModuleTwo';
import PieChart from '@/common/Charts/PieChart';

const ChartModuleTwo = ({ chartName }: { chartName: string }) => {
    const [widgetTitle, setWidgetTitle] = useState("My-CSV");

    const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(3);

    const [legendValues, setLegendValues] = useState<LegendValue[]>([
        { label: "", field: "", color: "#13A490" },
        { label: "", field: "", color: "#35B6EE" },
        { label: "", field: "", color: "#6F78F9" },
    ]);
    const [startingRange, setStartingRange] = useState<number>(0); //this is not for pic chart means it is optional
    const [endingRange, setEndingRange] = useState<number>(100); //this is not for pic chart means it is optional


    return (
        <div className="flex justify-between gap-3">
            {(() => {
                if (chartName === "pie-chart") {
                    return (
                        <PieChart
                            title={widgetTitle}
                            legendValues={legendValues}
                        />
                    );
                } else if (chartName === "progress-ring-chart") {
                    return (
                        <></>
                    );
                }
                return null;
            })()}

            <WidgetForChartModuleTwo
                widgedName={chartName === "pie-chart" ? "Pie Chart" :
                    chartName === "progress-ring-chart" ? "Progress Ring Chart" :
                        ""}
                widgetTitle={widgetTitle}
                setWidgetTitle={setWidgetTitle}
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

export default ChartModuleTwo;