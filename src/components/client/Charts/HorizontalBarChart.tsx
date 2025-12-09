import React, { useState } from 'react';
import { Copy, Trash2 } from 'lucide-react';

interface DataItem {
  label: string;
  value: number;
}

const HorizontalBarChart: React.FC = () => {
  const [data] = useState<DataItem[]>([
    { label: 'Alpha', value: 95 },
    { label: 'Beta', value: 82 },
    { label: 'Gamma', value: 73 },
    { label: 'Delta', value: 59 },
    { label: 'Epsilon', value: 48 },
    { label: 'Zeta', value: 37 },
    { label: 'Omega', value: 27 }
  ]);

  const maxValue = 110;
  const totalUsage = data.reduce((sum, item) => sum + item.value, 0);

  const handleCopy = () => {
    console.log('Copy chart');
  };

  const handleDelete = () => {
    console.log('Delete chart');
  };


  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Horizontal Bar Chart</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
            title="Copy"
          >
            <Copy size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Legend and Total */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <span className="text-sm text-gray-600">Usage Rate</span>
        </div>
        <div className="text-sm text-gray-600">
          Total usage <span className="font-semibold text-gray-900">{totalUsage}k</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-4 mb-6">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-16 text-right text-sm text-gray-600">{item.label}</div>
            <div className="flex-1 relative">
              <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-lg transition-all duration-500 ease-out"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-10 text-sm font-medium text-gray-700">{item.value}k</div>
          </div>
        ))}
      </div>

      {/* X-Axis Scale */}
      <div className="relative ml-20 mr-14 h-6">
        <div className="absolute inset-0 flex justify-between text-xs text-gray-400">
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110].map((tick) => (
            <div key={tick} className="relative">
              <div className="absolute -top-1 left-0 w-px h-2 bg-gray-300" />
              <div className="absolute top-2 left-0 -translate-x-1/2">{tick}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalBarChart;