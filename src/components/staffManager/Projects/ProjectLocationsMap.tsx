import React, { useMemo } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";

/* ---------------- TYPES ---------------- */

interface Project {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface ProjectLocationsMapProps {
  projects: Project[];
}

const containerStyle = {
  width: "100%",
  height: "80vh",
  margin: "20px 0px",
  borderRadius: "8px",
};

const ProjectLocationsMap: React.FC<ProjectLocationsMapProps> = ({
  projects,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  console.log("ggle map data: ", projects);
  

  const center = useMemo(() => {
    if (projects.length === 0) {
      return { lat: 0, lng: 0 };
    }

    return {
      lat: projects[0].latitude,
      lng: projects[0].longitude,
    };
  }, [projects]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-gray-500 text-sm">Loading map...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={6}
    >
      {projects.map((project) => (
        <Marker
          key={project.id}
          position={{
            lat: project.latitude,
            lng: project.longitude,
          }}
          title={project.name}
        />
      ))}
    </GoogleMap>
  );
};

export default ProjectLocationsMap;
