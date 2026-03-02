/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
  useMapEvents,
  Marker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Maximize2, Layers } from "lucide-react";
import L from "leaflet";
import ChartCardWrapper from "./CompletedCharts/Common/ChartCardWrapper";

// Fix for default marker icons in Leaflet with React
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

/*     TYPES     */

type MapPoint = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  value: number;
  color?: string;
};

type Props = {
  widgetTitle?: string;
  points?: MapPoint[];
  overlayType?: "choropleth" | "bubble";
  startingZoom?: number;
  center?: [number, number];
  onToggleWidget?: () => void;
  onDelete?: () => void;
  onMapClick?: (lat: number, lng: number) => void;
  onPointMove?: (id: string, lat: number, lng: number) => void;
  height?: number;
  isPreview?: boolean;
};

/*     HELPERS     */

// Re-centers map when center or points change
function ChangeView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  const lastView = useRef({ lat: center[0], lng: center[1], zoom });

  useEffect(() => {
    const hasMoved =
      lastView.current.lat !== center[0] ||
      lastView.current.lng !== center[1] ||
      lastView.current.zoom !== zoom;

    if (hasMoved) {
      map.setView(center, zoom);
      lastView.current = { lat: center[0], lng: center[1], zoom };
    }
  }, [center, zoom, map]);
  return null;
}

function MapEvents({
  onMapClick,
}: {
  onMapClick?: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

/*     COMPONENT     */

export default function GeographicMapChart({
  widgetTitle = "Geographic Analysis",
  points = [
    {
      id: "1",
      name: "New York",
      lat: 40.7128,
      lng: -74.006,
      value: 80,
      color: "#4F46E5",
    },
    {
      id: "2",
      name: "London",
      lat: 51.5074,
      lng: -0.1278,
      value: 65,
      color: "#10B981",
    },
    {
      id: "3",
      name: "Tokyo",
      lat: 35.6762,
      lng: 139.6503,
      value: 95,
      color: "#F59E0B",
    },
    {
      id: "4",
      name: "Sydney",
      lat: -33.8688,
      lng: 151.2093,
      value: 45,
      color: "#EF4444",
    },
  ],
  overlayType = "bubble",
  startingZoom = 2,
  center = [20, 0],
  onToggleWidget,
  onDelete,
  onMapClick,
  height = 400,
  onPointMove,
  isPreview = false,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [mapType, setMapType] = useState<"light" | "dark" | "satellite">(
    "light",
  );

  const tileUrl = useMemo(() => {
    switch (mapType) {
      case "dark":
        return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
      case "satellite":
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      default:
        return "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
    }
  }, [mapType]);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(points, null, 2));
  };

  const handleDownload = () => {
    setIsDownloading(true);
    const header = "Name,Latitude,Longitude,Value,Color";
    const rows = points.map(
      (p) => `${p.name},${p.lat},${p.lng},${p.value},${p.color}`,
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${widgetTitle}.csv`;
    a.click();
    setIsDownloading(false);
  };

  return (
    <ChartCardWrapper
      title={widgetTitle}
      menuActions={{
        onCopy: handleCopy,
        onDownload: handleDownload,
        onDelete: onDelete,
        onToggleWidget: onToggleWidget,
      }}
      isDownloading={isDownloading}
      isPreview={isPreview}
      customHeaderContent={
        <div className="flex gap-2">
          <button
            onClick={() => setMapType("light")}
            className={`text-[10px] px-2 py-0.5 rounded border ${mapType === "light" ? "bg-blue-50 border-blue-200 text-blue-600" : "border-gray-200 text-gray-500"}`}
          >
            Light
          </button>
          <button
            onClick={() => setMapType("dark")}
            className={`text-[10px] px-2 py-0.5 rounded border ${mapType === "dark" ? "bg-gray-800 border-gray-700 text-white" : "border-gray-200 text-gray-500"}`}
          >
            Dark
          </button>
          <button
            onClick={() => setMapType("satellite")}
            className={`text-[10px] px-2 py-0.5 rounded border ${mapType === "satellite" ? "bg-green-50 border-green-200 text-green-600" : "border-gray-200 text-gray-500"}`}
          >
            Satellite
          </button>
        </div>
      }
      footer={
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3 text-left">
            <div className="p-2 bg-blue-100 rounded text-blue-600">
              <Layers size={16} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-tighter font-bold">
                Total Locations
              </p>
              <p className="text-lg font-bold">{points.length}</p>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3 text-left">
            <div className="p-2 bg-orange-100 rounded text-orange-600">
              <Maximize2 size={16} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-tighter font-bold">
                Avg. Index
              </p>
              <p className="text-lg font-bold">
                {(
                  points.reduce((acc, p) => acc + p.value, 0) / points.length
                ).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      }
    >
      {/* Map Container */}
      <div
        className="relative rounded-lg overflow-hidden border border-gray-100 shadow-inner group"
        style={{ height: `${height}px` }}
      >
        <MapContainer
          center={center as any}
          zoom={startingZoom}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <ChangeView center={center} zoom={startingZoom} />
          <MapEvents onMapClick={onMapClick} />
          <TileLayer url={tileUrl} />

          {overlayType === "bubble"
            ? points.map((point) => (
                <CircleMarker
                  key={point.id}
                  center={[point.lat, point.lng]}
                  radius={Math.sqrt(point.value) * 1.5}
                  pathOptions={{
                    fillColor: point.color || "#3B82F6",
                    color: "#FFFFFF",
                    weight: 1,
                    fillOpacity: 0.7,
                  }}
                >
                  <Popup>
                    <div className="p-1">
                      <h4 className="font-bold text-sm">{point.name}</h4>
                      <p className="text-xs text-gray-600">
                        Value:{" "}
                        <span className="font-semibold">{point.value}</span>
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))
            : points.map((point) => (
                <Marker
                  key={point.id}
                  position={[point.lat, point.lng]}
                  draggable={!!onPointMove && !isPreview}
                  eventHandlers={{
                    dragend: (e) => {
                      const marker = e.target;
                      const position = marker.getLatLng();
                      if (onPointMove)
                        onPointMove(point.id, position.lat, position.lng);
                    },
                  }}
                >
                  <Popup>
                    <div className="p-1">
                      <h4 className="font-bold text-sm">{point.name}</h4>
                      <p className="text-xs text-gray-400">Drag to move</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
        </MapContainer>

        {/* Floating Overlay Info */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded border border-gray-200 shadow-sm z-400 text-[10px] pointer-events-none">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-gray-700 font-medium">Activity Level</span>
          </div>
          <p className="text-gray-500 italic">Visualizing global footprint</p>
        </div>
      </div>
    </ChartCardWrapper>
  );
}
