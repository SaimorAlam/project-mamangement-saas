import React, { useState } from "react";
import ParetoChart from "@/common/Charts/ParetoChart";

const ParetoChartModule = () => {
  const [widgetTitle, setWidgetTitle] = useState("Customer Complaints");
  const [showWidget, setShowWidget] = useState(false);

  const [numOfXAxisDataSet, setNumOfXAxisDataSet] = useState<number>(1);
  const [xAxisValues, setXAxisValues] = useState<string[]>([]);

  const [startingRange, setStartingRange] = useState<number>(4);
  const [endingRange, setEndingRange] = useState<number>(104);

  const minXaxisField = 1;
  const maxXaxisField = 10;

  const handleSetNumOfXAxisDataSet = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      setNumOfXAxisDataSet(1);
    } else if (value >= minXaxisField && value <= maxXaxisField) {
      setNumOfXAxisDataSet(value);
    } else {
      setNumOfXAxisDataSet(1);
      alert(
        `Please enter a number between ${minXaxisField} and ${maxXaxisField}`
      );
    }

    setXAxisValues((prev) => {
      const updated = [...prev];
      while (updated.length < value) {
        updated.push("");
      }
      return updated.slice(0, value);
    });
  };

  const handleXAxisValueChange = (index: number, value: string) => {
    setXAxisValues((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleToggleWidget = () => {
    setShowWidget(!showWidget);
  };

  const handleCloseWidget = () => {
    setShowWidget(false);
  };

  return (
    <div className="flex gap-3">
      <ParetoChart
        widgetTitle={widgetTitle}
        xAxisValues={xAxisValues}
        startingRange={startingRange}
        endingRange={endingRange}
        onToggleWidget={handleToggleWidget}
      />
      {showWidget && (
        <div className="w-96 bg-white border border-gray-200 rounded-lg p-6 h-fit">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Pareto Configuration</h3>
            <button
              onClick={handleCloseWidget}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Widget Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chart Title
            </label>
            <input
              type="text"
              value={widgetTitle}
              onChange={(e) => setWidgetTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter chart title"
            />
          </div>

          {/* Number of Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Categories (1-{maxXaxisField})
            </label>
            <input
              type="number"
              value={numOfXAxisDataSet}
              onChange={handleSetNumOfXAxisDataSet}
              min={minXaxisField}
              max={maxXaxisField}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Names */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Names
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Array.from({ length: numOfXAxisDataSet }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  value={xAxisValues[index] || ""}
                  onChange={(e) =>
                    handleXAxisValueChange(index, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Category ${index + 1} name`}
                />
              ))}
            </div>
          </div>

          {/* Value Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Maximum Value
                </label>
                <input
                  type="number"
                  value={endingRange}
                  onChange={(e) => setEndingRange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Minimum Value
                </label>
                <input
                  type="number"
                  value={startingRange}
                  onChange={(e) => setStartingRange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Values will be sorted in descending order
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-purple-900 mb-2">
              Pareto Chart (80/20 Rule)
            </h4>
            <ul className="text-xs text-purple-700 space-y-1">
              <li>• Shows bars + cumulative % line</li>
              <li>• Categories sorted by frequency</li>
              <li>• Identifies vital few vs trivial many</li>
              <li>• Perfect for quality analysis</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParetoChartModule;