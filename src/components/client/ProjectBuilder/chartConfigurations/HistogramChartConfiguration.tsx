import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export type LegendValue = {
  label: string;
  field: string;
  color: string;
};

type HistogramChartConfigurationProps = {
  widgetTitle: string;
  setWidgetTitle: (title: string) => void;
  
  numOfXAxisDataSet: number;
  handleSetNumOfXAxisDataSet: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  xAxisValues: string[];
  handleXAxisValueChange: (index: number, value: string) => void;
  
  numOfLegendDataSet: number;
  setNumOfLegendDataSet: (num: number) => void;
  
  legendValues: LegendValue[];
  setLegendValues: (values: LegendValue[]) => void;
  
  startingRange: number;
  setStartingRange: (range: number) => void;
  
  endingRange: number;
  setEndingRange: (range: number) => void;
  
  onClose: () => void;
};

const HistogramChartConfiguration: React.FC<HistogramChartConfigurationProps> = ({
  widgetTitle,
  setWidgetTitle,
  numOfXAxisDataSet,
  handleSetNumOfXAxisDataSet,
  xAxisValues,
  handleXAxisValueChange,
  numOfLegendDataSet,
  setNumOfLegendDataSet,
  legendValues,
  setLegendValues,
  startingRange,
  setStartingRange,
  endingRange,
  setEndingRange,
  onClose,
}) => {
  const [localLegendValues, setLocalLegendValues] = useState<LegendValue[]>([...legendValues]);

  // Sync local state with parent when parent changes
  useEffect(() => {
    setLocalLegendValues([...legendValues]);
  }, [legendValues]);

  // Handle legend count change
  const handleLegendCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    if (!isNaN(count) && count >= 1 && count <= 5) {
      setNumOfLegendDataSet(count);
      
      // Adjust local legend values array
      const newLegendValues = [...localLegendValues];
      if (count > newLegendValues.length) {
        // Add new legend items
        while (newLegendValues.length < count) {
          newLegendValues.push({
            label: "",
            field: "",
            color: "#8D79F6"
          });
        }
      } else {
        // Remove extra legend items
        newLegendValues.splice(count);
      }
      setLocalLegendValues(newLegendValues);
      setLegendValues(newLegendValues);
    }
  };

  // Handle legend label change
  const handleLegendLabelChange = (index: number, value: string) => {
    const updated = [...localLegendValues];
    updated[index] = { ...updated[index], label: value };
    setLocalLegendValues(updated);
    setLegendValues(updated);
  };

  // Handle legend field change
  const handleLegendFieldChange = (index: number, value: string) => {
    const updated = [...localLegendValues];
    updated[index] = { ...updated[index], field: value };
    setLocalLegendValues(updated);
    setLegendValues(updated);
  };

  // Handle legend color change
  const handleLegendColorChange = (index: number, color: string) => {
    const updated = [...localLegendValues];
    updated[index] = { ...updated[index], color };
    setLocalLegendValues(updated);
    setLegendValues(updated);
  };

  return (
    <div className="w-80 bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <h2 className="font-medium">Chart Configuration</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X size={18} />
        </button>
      </div>

      {/* Configuration Form */}
      <div className="p-4 space-y-4">
        {/* Chart Title */}
        <div>
          <label className="block text-sm mb-1">Chart Title</label>
          <input
            type="text"
            value={widgetTitle}
            onChange={(e) => setWidgetTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Data Range */}
        <div>
          <h3 className="font-medium mb-2">Data Range</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1">Starting Range</label>
              <input
                type="number"
                value={startingRange}
                onChange={(e) => setStartingRange(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Ending Range</label>
              <input
                type="number"
                value={endingRange}
                onChange={(e) => setEndingRange(parseInt(e.target.value) || 100)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* X-Axis Configuration */}
        <div>
          <h3 className="font-medium mb-2">X-Axis Configuration</h3>
          <div className="mb-3">
            <label className="block text-sm mb-1">Number of X-Axis Data Sets</label>
            <input
              type="number"
              value={numOfXAxisDataSet}
              onChange={handleSetNumOfXAxisDataSet}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              min="1"
              max="10"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">X-Axis Labels</label>
            {Array.from({ length: numOfXAxisDataSet }).map((_, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  value={xAxisValues[index] || ""}
                  onChange={(e) => handleXAxisValueChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder={`Label ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Legend Configuration */}
        <div>
          <h3 className="font-medium mb-2">Legend Configuration</h3>
          <div className="mb-3">
            <label className="block text-sm mb-1">Number of Legends</label>
            <input
              type="number"
              value={numOfLegendDataSet}
              onChange={handleLegendCountChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              min="1"
              max="5"
            />
          </div>

          <div className="space-y-3">
            {localLegendValues.map((legend, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded">
                <h4 className="font-medium mb-2">Legend {index + 1}</h4>
                
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs mb-1">Label</label>
                    <input
                      type="text"
                      value={legend.label}
                      onChange={(e) => handleLegendLabelChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs mb-1">Field Name</label>
                    <input
                      type="text"
                      value={legend.field}
                      onChange={(e) => handleLegendFieldChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs mb-1">Color</label>
                    <input
                      type="color"
                      value={legend.color}
                      onChange={(e) => handleLegendColorChange(index, e.target.value)}
                      className="w-full h-8"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistogramChartConfiguration;