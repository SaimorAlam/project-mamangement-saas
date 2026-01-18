import React, { Dispatch, SetStateAction } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { RibbonSeries } from "@/common/Charts/RibbonChart";

interface RibbonConfigurationProps {
  widgetTitle: string;
  setWidgetTitle: (title: string) => void;
  categories: string[];
  setCategories: Dispatch<SetStateAction<string[]>>;
  series: RibbonSeries[];
  setSeries: Dispatch<SetStateAction<RibbonSeries[]>>;
  onClose: () => void;
}

const RibbonConfiguration: React.FC<RibbonConfigurationProps> = ({
  widgetTitle,
  setWidgetTitle,
  categories,
  setCategories,
  series,
  setSeries,
  onClose,
}) => {
  // --- Category Handlers ---
  const handleAddCategory = () => {
    setCategories([...categories, `New Cat ${categories.length + 1}`]);
    // Add a 0 value to each series for the new category
    setSeries(
      series.map((s) => ({
        ...s,
        data: [...s.data, 0],
      }))
    );
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newCats = [...categories];
    newCats[index] = value;
    setCategories(newCats);
  };

  const handleDeleteCategory = (index: number) => {
    if (categories.length <= 2) {
      alert("Minimum 2 categories required for ribbon chart.");
      return;
    }
    const newCats = categories.filter((_, i) => i !== index);
    setCategories(newCats);
    // Remove corresponding data point from each series
    setSeries(
      series.map((s) => ({
        ...s,
        data: s.data.filter((_, i) => i !== index),
      }))
    );
  };

  // --- Series Handlers ---
  const handleAddSeries = () => {
    const newId = `s-${Date.now()}`;
    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00c49f"];
    const randomColor = colors[series.length % colors.length];
    
    setSeries([
      ...series,
      {
        id: newId,
        name: `Series ${series.length + 1}`,
        color: randomColor,
        data: new Array(categories.length).fill(0),
      },
    ]);
  };

  const handleSeriesNameChange = (index: number, value: string) => {
    const newSeries = [...series];
    newSeries[index].name = value;
    setSeries(newSeries);
  };

  const handleSeriesColorChange = (index: number, value: string) => {
    const newSeries = [...series];
    newSeries[index].color = value;
    setSeries(newSeries);
  };

  const handleDeleteSeries = (index: number) => {
    setSeries(series.filter((_, i) => i !== index));
  };

  // --- Value Handler ---
  const handleValueChange = (seriesIndex: number, catIndex: number, value: string) => {
    const numValue = parseInt(value) || 0;
    const newSeries = [...series];
    newSeries[seriesIndex].data[catIndex] = numValue;
    setSeries(newSeries);
  };

  return (
    <div className="min-w-[350px] w-1/3 h-fit max-h-[calc(100vh-100px)] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col shrink-0 transition-all duration-300">
      <div className="flex justify-between items-center p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">Configuration</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Widget Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Widget Title</label>
          <input
            type="text"
            value={widgetTitle}
            onChange={(e) => setWidgetTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Enter chart title"
          />
        </div>

        {/* Categories Manager */}
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700">Categories (X-Axis)</label>
                <button onClick={handleAddCategory} className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {categories.map((cat, i) => (
                    <div key={i} className="flex items-center bg-gray-100 rounded-full px-3 py-1 border border-gray-200 group hover:border-blue-300 transition-colors">
                        <input 
                            value={cat}
                            onChange={(e) => handleCategoryChange(i, e.target.value)}
                            className="bg-transparent border-none outline-none text-xs w-16 text-center focus:w-24 transition-all"
                        />
                         <button 
                            onClick={() => handleDeleteCategory(i)}
                            className="ml-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* Series Data Manager */}
        <div className="space-y-3">
             <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700">Series Data</label>
                <button onClick={handleAddSeries} className="text-xs text-green-600 hover:text-green-800 font-medium flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Series
                </button>
            </div>

            <div className="space-y-3">
                {series.map((s, sIndex) => (
                    <div key={s.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <input 
                                type="color" 
                                value={s.color} 
                                onChange={(e) => handleSeriesColorChange(sIndex, e.target.value)}
                                className="w-6 h-6 rounded cursor-pointer border-none bg-transparent shrink-0"
                            />
                            <input 
                                value={s.name} 
                                onChange={(e) => handleSeriesNameChange(sIndex, e.target.value)}
                                className="font-medium text-sm bg-transparent border-b border-transparent focus:border-blue-400 outline-none w-full"
                                placeholder="Series Name"
                            />
                             <button onClick={() => handleDeleteSeries(sIndex)} className="text-gray-400 hover:text-red-600 p-1">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map((cat, cIndex) => (
                                <div key={cIndex} className="flex items-center justify-between bg-white rounded border border-gray-100 px-2 py-1">
                                    <span className="text-[10px] text-gray-500 truncate mr-2 max-w-[50px]" title={cat}>{cat}</span>
                                    <input 
                                        type="number" 
                                        value={s.data[cIndex]} 
                                        onChange={(e) => handleValueChange(sIndex, cIndex, e.target.value)} 
                                        className="w-16 text-right text-xs outline-none bg-transparent font-mono"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Assigned By */}
        <div className="pt-4 border-t border-gray-100">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Assigned by
          </label>
          <div className="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              alt="Alexis Burg"
              className="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <p className="text-xs font-medium text-gray-900">
                Alexis Burg
              </p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>

       <div className="flex items-center justify-between gap-3 p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-medium border border-gray-200 rounded-md cursor-pointer text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 cursor-pointer shadow-sm transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default RibbonConfiguration;
