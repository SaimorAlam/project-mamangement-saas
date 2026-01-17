/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { X } from "lucide-react";


interface KPISettings {
  showIndex: boolean;
  showFooter: boolean;
  showFooterLabel: boolean;
  showFooterButton: boolean;
}

interface KPIWidgetConfigProps {
  config: KPISettings;
  setConfig: React.Dispatch<React.SetStateAction<KPISettings>>;
  data?: any;
  onUpdateData?: (newData: any) => void;
  onClose: () => void;
}

const KPIWidgetConfig: React.FC<KPIWidgetConfigProps> = ({
  config,
  setConfig,
//   data,
//   onUpdateData,
  onClose,
}) => {
  const handleChange = (key: keyof KPISettings) => {
    setConfig((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

//   const handleDataChange = (key: string, value: string) => {
//     if (onUpdateData && data) {
//         onUpdateData({ ...data, [key]: value });
//     }
//   }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">
          Widget Configuration
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 px-4 py-4 space-y-6 overflow-y-auto max-h-[600px]">
        {/* Widget Details Link */}
        {/* <div>
           <a href="#" className="text-blue-500 font-medium text-xs hover:underline">
               KPI Widget Details
           </a>
        </div> */}
        
        {/* Data Fields */}
        {/* {data && (
            <div className="space-y-3">
                 <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                    <input 
                        type="text" 
                        value={data.title} 
                        onChange={(e) => handleDataChange('title', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                 </div>
                 <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                        <input 
                            type="text" 
                            value={data.value} 
                            onChange={(e) => handleDataChange('value', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Growth</label>
                        <input 
                            type="text" 
                            value={data.growth} 
                            onChange={(e) => handleDataChange('growth', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <input 
                        type="text" 
                        value={data.description} 
                        onChange={(e) => handleDataChange('description', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                 </div>
            </div>
        )}

        {/* Display Settings */}
        <div>
          <h3 className="text-blue-500 font-medium text-xs mb-3 uppercase tracking-wider">Display Settings</h3>
          <div className="space-y-3">
            {/* Toggle Item */}
            <ToggleRow 
                label="Show Index" 
                checked={config.showIndex} 
                onChange={() => handleChange("showIndex")} 
            />
            <ToggleRow 
                label="Show Footer" 
                checked={config.showFooter} 
                onChange={() => handleChange("showFooter")} 
            />
            <ToggleRow 
                label="Show Footer Label" 
                checked={config.showFooterLabel} 
                onChange={() => handleChange("showFooterLabel")} 
            />
            <ToggleRow 
                label="Show Footer Button" 
                checked={config.showFooterButton} 
                onChange={() => handleChange("showFooterButton")} 
            />
          </div>
        </div>

        {/* Assigned By */}
        {/* <div>
           <h3 className="text-gray-800 font-medium text-xs mb-3">Assigned by</h3>
           <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-pink-100 overflow-hidden">
                   <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                      alt="User" 
                      className="w-full h-full object-cover"
                   />
               </div>
               <div>
                   <p className="text-sm font-semibold text-gray-800">Kathryn Murphy</p>
                   <p className="text-xs text-gray-500">Admin</p>
               </div>
           </div>
        </div> */}
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-3 border-t border-gray-200 flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onClose} 
          className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

const ToggleRow = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
    <div className="flex items-center justify-between">
        <span className="text-gray-700 text-sm font-medium">{label}</span>
        <button 
           onClick={onChange}
           className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
            <span 
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
            />
        </button>
    </div>
);

export default KPIWidgetConfig;
