"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

// Fix Leaflet marker icon issue in Next.js
const icon = L.icon({
  iconUrl: "/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapAddressPickerProps {
  onAddressSelect: (address: string) => void;
  defaultLocation?: { lat: number; lng: number };
}

function LocationMarker({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : <Marker position={position} icon={icon} />;
}

export default function MapAddressPicker({
  onAddressSelect,
}: MapAddressPickerProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // Default to somewhere central in India if no local
  const defaultCenter = { lat: 20.5937, lng: 78.9629 };

  const handleLocateMe = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
          await reverseGeocode(latitude, longitude);
          setLoading(false);
        },
        () => {
          setLoading(false);
          alert("Could not detect location.");
        }
      );
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data && data.display_name) {
        onAddressSelect(data.display_name);
      }
    } catch (error) {
      console.error("Geocoding too fast or failed", error);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Pin Location on Map
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleLocateMe}
          className="h-6 text-xs"
        >
          <MapPin className="mr-1 h-3 w-3" />
          {loading ? "Locating..." : "Locate Me"}
        </Button>
      </div>
      <div className="h-[200px] w-full rounded-md overflow-hidden border">
        {typeof window !== "undefined" && (
          <MapContainer
            center={position || defaultCenter}
            zoom={position ? 13 : 4}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker
              onLocationSelect={(lat, lng) => {
                setPosition({ lat, lng });
                reverseGeocode(lat, lng);
              }}
            />
            {position && <Marker position={position} icon={icon} />}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
