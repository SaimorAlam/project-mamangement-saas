import FunnelChart from "@/common/Charts/FunnelChart";
import React, { useState } from "react";

const FunnelChartModule = () => {
  const [widgetTitle, setWidgetTitle] = useState("Recruitment Funnel");
  const [showWidget, setShowWidget] = useState(false);

  const [numOfXAxisDataSet, setNumOfXAxisDataSet] = useState<number>(1);
  const [xAxisValues, setXAxisValues] = useState<string[]>([]);

  const [startingRange, setStartingRange] = useState<number>(200);
  const [endingRange, setEndingRange] = useState<number>(1380);

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
      <FunnelChart
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
            <h3 className="text-lg font-semibold">Funnel Configuration</h3>
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

          {/* Number of Stages */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Funnel Stages (1-{maxXaxisField})
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

          {/* Stage Names */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stage Names
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Array.from({ length: numOfXAxisDataSet }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  value={xAxisValues[index] || ""}
                  onChange={(e) => handleXAxisValueChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Stage ${index + 1} name`}
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
                  Starting Value (Top)
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
                  Ending Value (Bottom)
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
              Values will decrease from top to bottom automatically
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              💡 Funnel Chart Tips
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Use for conversion processes</li>
              <li>• Stages flow from top to bottom</li>
              <li>• Values automatically decrease</li>
              <li>• Perfect for sales pipelines</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FunnelChartModule;