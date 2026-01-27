import { useState, useMemo } from "react";
import GeographicMapChart from "@/common/Charts/GeographicMapChart";
import GeographicMapConfiguration, { MapPoint } from "../chartConfigurations/GeographicMapConfiguration";

type GeographicMapModuleProps = {
  onDelete?: () => void;
  isPreview?: boolean;
};

const GeographicMapModule = ({ onDelete, isPreview = false }: GeographicMapModuleProps) => {
  const [widgetTitle, setWidgetTitle] = useState("Global Footprint");
  const [showWidget, setShowWidget] = useState(false);

  // Initialize with some demo points
  const [points, setPoints] = useState<MapPoint[]>([
    { id: "1", name: "New York Hub", lat: 40.7128, lng: -74.0060, value: 85, color: "#4F46E5" },
    { id: "2", name: "London Office", lat: 51.5074, lng: -0.1278, value: 70, color: "#10B981" },
    { id: "3", name: "Tokyo HQ", lat: 35.6762, lng: 139.6503, value: 98, color: "#F59E0B" },
    { id: "4", name: "Sydney Branch", lat: -33.8688, lng: 151.2093, value: 50, color: "#EF4444" },
    { id: "5", name: "Cape Town", lat: -33.9249, lng: 18.4241, value: 65, color: "#8B5CF6" },
  ]);

  const [overlayType, setOverlayType] = useState<"choropleth" | "bubble">("bubble");
  const [startingZoom, setStartingZoom] = useState<number>(2);
  const [pickingId, setPickingId] = useState<string | null>(null);

  const defaultCenter = useMemo<[number, number]>(() => [20, 0], []);

  const handleToggleWidget = () => {
    if (!isPreview) {
      setShowWidget(!showWidget);
      if (showWidget) setPickingId(null);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (!isPreview && pickingId) {
      setPoints((prev) =>
        prev.map((p) => (p.id === pickingId ? { ...p, lat, lng } : p))
      );
      setPickingId(null); // Auto-disable after picking
    }
  };

  const handlePointMove = (id: string, lat: number, lng: number) => {
    if (!isPreview) {
      setPoints((prev) =>
        prev.map((p) => (p.id === id ? { ...p, lat, lng } : p))
      );
    }
  };

  return (
    <div className="flex gap-3 h-full w-full">
      <div className="flex-1 h-full sticky top-5">
        <GeographicMapChart
          widgetTitle={widgetTitle}
          points={points}
          overlayType={overlayType}
          startingZoom={startingZoom}
          center={defaultCenter}
          onToggleWidget={handleToggleWidget}
          onDelete={onDelete}
          onMapClick={handleMapClick}
          onPointMove={handlePointMove}
          height={400}
          isPreview={isPreview}
        />
      </div>
      {!isPreview && showWidget && (
        <GeographicMapConfiguration
          widgetTitle={widgetTitle}
          setWidgetTitle={setWidgetTitle}
          points={points}
          setPoints={setPoints}
          overlayType={overlayType}
          setOverlayType={setOverlayType}
          startingZoom={startingZoom}
          setStartingZoom={setStartingZoom}
          pickingId={pickingId}
          setPickingId={setPickingId}
          onClose={() => {
            setShowWidget(false);
            setPickingId(null);
          }}
        />
      )}
    </div>
  );
};

export default GeographicMapModule;
