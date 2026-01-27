/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

const projects = [
  {
    id: 1,
    name: "Project A",
    lat: 23.7461,
    lng: 90.3742,
    color: "#E53935",
  },
  {
    id: 2,
    name: "Project B",
    lat: 23.7515,
    lng: 90.3779,
    color: "#E53935",
  },
  {
    id: 3,
    name: "Project C",
    lat: 23.7545,
    lng: 90.3825,
    color: "#E53935",
  },
  {
    id: 4,
    name: "Project D",
    lat: 23.7489,
    lng: 90.3856,
    color: "#E53935",
  },
  {
    id: 5,
    name: "Project E",
    lat: 23.7425,
    lng: 90.3812,
    color: "#E53935",
  },
  {
    id: 6,
    name: "Project F",
    lat: 23.7398,
    lng: 90.3765,
    color: "#E53935",
  },
  {
    id: 7,
    name: "Project G",
    lat: 23.752,
    lng: 90.3698,
    color: "#E53935",
  },
];

const HighwayMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    const initializeMap = () => {
      const L = (window as any).L;
      if (!L || mapInstanceRef.current) return;

      // Fix for "Map container is being reused by another instance"
      const container = L.DomUtil.get(mapRef.current);
      if (container != null) {
        container._leaflet_id = null;
      }

      const mapInstance = L.map(mapRef.current).setView([23.7461, 90.3779], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstance);

      const customIcon = L.divIcon({
        className: "custom-marker",
        html: '<div style="background-color: #E53935; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><div style="width: 12px; height: 12px; background-color: white; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div></div>',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      projects.forEach((project) => {
        L.marker([project.lat, project.lng], { icon: customIcon })
          .addTo(mapInstance)
          .bindPopup(`<strong>${project.name}</strong>`);
      });

      mapInstanceRef.current = mapInstance;
    };

    // Load styles
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
      document.head.appendChild(link);
    }

    // Load script
    if (!(window as any).L) {
      if (!document.querySelector('script[src*="leaflet.js"]')) {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
        script.onload = initializeMap;
        document.body.appendChild(script);
      }
    } else {
      initializeMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white  z-10  py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div>
              <h1 className="text-lg font-medium text-gray-800">
                All Project location of Highway Expansion Program
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative z-10">
        <div ref={mapRef} className="w-full h-full"></div>

        {/* Info Card - Top Left */}
        <div className="absolute top-4 left-15 bg-white rounded-lg shadow-lg p-4 w-64 z-10 pointer-events-auto">
          {/* Building Name with Red Dot */}
          <div className="flex items-start gap-2 mb-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0"></div>
            <h3 className="text-sm font-semibold text-gray-800 leading-tight">
              Carlyle Hall
            </h3>
          </div>

          {/* Address */}
          <div className="text-xs text-gray-600 mb-1 pl-4">
            25 Union Square W, New
          </div>
          <div className="text-xs text-gray-600 mb-1 pl-4">
            York, NY 10003, USA
          </div>
          <div className="text-xs text-gray-600 mb-3 pl-4">DC3 Building</div>

          {/* View Report Details Link */}
          <div className="pl-4">
            <a
              href="#"
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              View Report Details
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* Circular Progress - Top Right Corner */}
          <div className="absolute -top-3 -right-3 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center z-100">
            <div className="relative w-14 h-14">
              {/* Background Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="#E5E7EB"
                  strokeWidth="4"
                  fill="none"
                />
                {/* Progress Circle */}
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="#3B82F6"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - 0.75)}`}
                  strokeLinecap="round"
                />
              </svg>
              {/* Percentage Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">75%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Attribution */}
        <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded shadow-md text-xs text-gray-600">
          © Google
        </div>
      </div>
    </div>
  );
};

export default HighwayMap;
