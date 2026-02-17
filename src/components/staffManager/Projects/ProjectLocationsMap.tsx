/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { useGetProgramAllProjectsQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";

const ProjectLocationsMap = ({ allFilteredProjects }: { allFilteredProjects: any }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  // const { data } = useGetProgramAllProjectsQuery({});
  const data = allFilteredProjects;

  /*   Extract Projects   */

  const projects = useMemo(() => {
    return (
      data?.data?.projects?.data?.filter(
        (p: any) =>
          p.latitude !== null &&
          p.longitude !== null &&
          !isNaN(p.latitude) &&
          !isNaN(p.longitude)
      ) ?? []
    );
  }, [data]);

  /*   Map Init   */

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    const initializeMap = () => {
      const L = (window as any).L;
      if (!L) return;

      if (!mapInstanceRef.current) {
        const mapInstance = L.map(mapRef.current).setView(
          [23.7461, 90.3779],
          13
        );

        L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          { attribution: "© OpenStreetMap contributors" }
        ).addTo(mapInstance);

        markersLayerRef.current = L.layerGroup().addTo(mapInstance);

        mapInstanceRef.current = mapInstance;
      }

      updateMarkers();
    };

    const updateMarkers = () => {
      const L = (window as any).L;
      if (!L || !mapInstanceRef.current) return;

      markersLayerRef.current.clearLayers();

      if (projects.length === 0) return;

      const bounds = L.latLngBounds([]);

      projects.forEach((project: any) => {
        const marker = L.marker([project.latitude, project.longitude])
          .bindPopup(`<strong>${project.name}</strong>`)
          .addTo(markersLayerRef.current);

        bounds.extend([project.latitude, project.longitude]);
      });

      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    };

    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    if (!(window as any).L) {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
      script.onload = initializeMap;
      document.body.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [projects]);

  return (
    <div className="w-full h-[80vh] rounded-xl bg-white flex flex-col my-10 overflow-hidden">
      {/* Header */}
      <div className="py-4">
        <h1 className="text-lg font-medium text-gray-800">
          All Project Locations
        </h1>
      </div>

      {/* Map */}
      <div className="flex-1 relative rounded-xl overflow-hidden">
        <div ref={mapRef} className="w-full h-full z-20"></div>

        {/* Static Info Card (Optional UI) */}
        <div className="absolute top-4 left-6 bg-white rounded-lg shadow-lg p-4 w-64 z-20">
          <div className="flex items-start gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5" />
            <h3 className="text-sm font-semibold text-gray-800">
              Live Project Map
            </h3>
          </div>

          <p className="text-xs text-gray-600 mb-2">
            Showing {projects.length} active project locations.
          </p>

          <a
            href="#"
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            View Details <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectLocationsMap;
