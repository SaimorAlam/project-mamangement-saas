import React from "react";
import { X, Plus, Trash2, MapPin } from "lucide-react";
import { useAppSelector } from "@/hooks/useRedux";
import { useCreateChartMutation } from "@/store/Api/ChartApi/ChartApi";
import { toast } from "sonner";

export type MapPoint = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  value: number;
  color?: string;
};

const GeographicMapConfiguration = ({
  widgetTitle,
  setWidgetTitle,
  points,
  setPoints,
  overlayType,
  setOverlayType,
  startingZoom,
  setStartingZoom,
  pickingId,
  setPickingId,
  onClose,
}: {
  widgetTitle: string;
  setWidgetTitle: React.Dispatch<React.SetStateAction<string>>;
  points: MapPoint[];
  setPoints: React.Dispatch<React.SetStateAction<MapPoint[]>>;
  overlayType: "choropleth" | "bubble";
  setOverlayType: React.Dispatch<React.SetStateAction<"choropleth" | "bubble">>;
  startingZoom: number;
  setStartingZoom: React.Dispatch<React.SetStateAction<number>>;
  pickingId: string | null;
  setPickingId: React.Dispatch<React.SetStateAction<string | null>>;
  onClose?: () => void;
}) => {
  const projectId = useAppSelector((state) => state.chartSlice.projectId);
  const [createChart, { isLoading }] = useCreateChartMutation();

  const handleAddPoint = () => {
    const newPoint: MapPoint = {
      id: crypto.randomUUID(),
      name: "New Place",
      lat: 0,
      lng: 0,
      value: 50,
      color: "#3B82F6",
    };
    setPoints([...points, newPoint]);
  };

  const handleUpdatePoint = (id: string, updates: Partial<MapPoint>) => {
    setPoints(points.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleRemovePoint = (id: string) => {
    setPoints(points.filter(p => p.id !== id));
  };

  const handleSave = async () => {
    const toastId = toast.loading("Saving map configuration...");
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: Record<string, any> = {
      numberOfDataset: points.length,
      firstFiledDataset: startingZoom,
      lastFiledDAtaset: 0,
      widgets: points.map((p) => ({
        legendName: p.name,
        color: p.color,
      })),
      title: widgetTitle,
      status: "ACTIVE",
      category: "MAP",
      xAxis: JSON.stringify({ points }), // Storing complexity in xAxis for maps
      yAxis: JSON.stringify({ overlayType }),
      zAxis: JSON.stringify({}),
      projectId,
    };

    try {
      const res = await createChart(payload).unwrap();
      if (res?.success) {
        toast.success("Geographic Map saved", { id: toastId });
        onClose?.();
      }
    } catch {
      toast.error("Failed to save map", { id: toastId });
    }
  };

  return (
    <div className="max-w-78 min-w-78 h-full bg-white border border-gray-100 rounded-lg shadow-lg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MapPin size={18} className="text-blue-600"/> Map Settings
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-6 overflow-y-auto flex-1">
        
        {/* Widget Title */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
            Widget Title
          </label>
          <input
            type="text"
            value={widgetTitle}
            onChange={(e) => setWidgetTitle(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Global Settings */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-[10px] text-gray-500 mb-1 uppercase">Zoom Level</label>
                <input
                    type="number"
                    min={1}
                    max={18}
                    value={startingZoom}
                    onChange={(e) => setStartingZoom(Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                />
            </div>
            <div>
                <label className="block text-[10px] text-gray-500 mb-1 uppercase">Overlay</label>
                <select 
                    value={overlayType}
                    onChange={(e) => setOverlayType(e.target.value as any)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                >
                    <option value="bubble">Bubble</option>
                    <option value="choropleth">Choropleth</option>
                </select>
            </div>
        </div>

        {/* Locations List */}
        <div>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Locations</h3>
                <button 
                    onClick={handleAddPoint}
                    className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                >
                    <Plus size={12}/> Add Location
                </button>
            </div>

            <div className="space-y-3">
                {points.map((point) => (
                    <div key={point.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50/50 space-y-2">
                        <div className="flex items-center justify-between">
                            <input
                                type="text"
                                value={point.name}
                                onChange={(e) => handleUpdatePoint(point.id, { name: e.target.value })}
                                className="flex-1 text-xs font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                            />
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setPickingId(pickingId === point.id ? null : point.id)}
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] transition-all ${pickingId === point.id ? 'bg-orange-500 border-orange-600 text-white shadow-inner animate-pulse' : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'}`}
                                    title="Capture coordinates by clicking the map"
                                >
                                    <MapPin size={12}/> {pickingId === point.id ? 'Picking...' : 'Pick Spot'}
                                </button>
                                <button onClick={() => handleRemovePoint(point.id)} className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded">
                                    <Trash2 size={14}/>
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] text-gray-400">Lat</label>
                                <input
                                    type="number"
                                    value={point.lat}
                                    onChange={(e) => handleUpdatePoint(point.id, { lat: Number(e.target.value) })}
                                    className="w-full px-1.5 py-0.5 text-[10px] border border-gray-200 rounded"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-400">Lng</label>
                                <input
                                    type="number"
                                    value={point.lng}
                                    onChange={(e) => handleUpdatePoint(point.id, { lng: Number(e.target.value) })}
                                    className="w-full px-1.5 py-0.5 text-[10px] border border-gray-200 rounded"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <label className="text-[10px] text-gray-400">Value</label>
                                <input
                                    type="number"
                                    value={point.value}
                                    onChange={(e) => handleUpdatePoint(point.id, { value: Number(e.target.value) })}
                                    className="w-full px-1.5 py-0.5 text-[10px] border border-gray-200 rounded"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-400 block">Color</label>
                                <input
                                    type="color"
                                    value={point.color}
                                    onChange={(e) => handleUpdatePoint(point.id, { color: e.target.value })}
                                    className="w-6 h-6 border-none cursor-pointer p-0"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50/50">
        <button
          onClick={onClose}
          className="px-4 py-1.5 text-xs font-medium border border-gray-200 rounded-md bg-white text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 shadow-md transition-all active:scale-95"
        >
          {isLoading ? "Saving Map..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default GeographicMapConfiguration;
