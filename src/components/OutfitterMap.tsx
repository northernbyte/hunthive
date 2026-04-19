"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Outfitter } from "@/lib/outfitters";

// Fix default marker icons for Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createOutfitterIcon(featured: boolean) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: ${featured ? 40 : 32}px;
        height: ${featured ? 40 : 32}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        background: ${featured ? "linear-gradient(135deg, #C45A1A, #E8763A)" : "linear-gradient(135deg, #2A4A1C, #3A6A2C)"};
        border: 2px solid ${featured ? "#E8763A" : "#4A8A3C"};
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        cursor: pointer;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: ${featured ? 16 : 13}px;
        ">🎯</span>
      </div>
    `,
    iconSize: [featured ? 40 : 32, featured ? 40 : 32],
    iconAnchor: [featured ? 20 : 16, featured ? 40 : 32],
    popupAnchor: [0, -(featured ? 40 : 32)],
  });
}

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 9, { duration: 1.2 });
  }, [map, lat, lng]);
  return null;
}

interface Props {
  outfitters: Outfitter[];
  selectedSpecies?: string;
  onSelect?: (outfitter: Outfitter) => void;
}

export default function OutfitterMap({ outfitters, selectedSpecies, onSelect }: Props) {
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number } | null>(null);

  const filtered = selectedSpecies
    ? outfitters.filter((o) => o.species.includes(selectedSpecies))
    : outfitters;

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[48.0, -96.0]}
        zoom={4}
        className="w-full h-full"
        style={{ background: "#1A2A1A" }}
        zoomControl={true}
      >
        {/* Dark outdoor tile layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />

        {flyTarget && <FlyTo lat={flyTarget.lat} lng={flyTarget.lng} />}

        {filtered.map((outfitter) => (
          <Marker
            key={outfitter.id}
            position={[outfitter.lat, outfitter.lng]}
            icon={createOutfitterIcon(outfitter.featured)}
            eventHandlers={{
              click: () => {
                setFlyTarget({ lat: outfitter.lat, lng: outfitter.lng });
                onSelect?.(outfitter);
              },
            }}
          >
            <Popup
              className="outfitter-popup"
              maxWidth={280}
            >
              <div
                style={{
                  background: "#111811",
                  border: "1px solid rgba(196,90,26,0.3)",
                  borderRadius: "12px",
                  padding: "14px",
                  color: "white",
                  minWidth: "240px",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {outfitter.featured && (
                  <span
                    style={{
                      display: "inline-block",
                      background: "linear-gradient(135deg, #C45A1A, #E8763A)",
                      color: "white",
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "2px 8px",
                      borderRadius: "20px",
                      marginBottom: "6px",
                    }}
                  >
                    FEATURED
                  </span>
                )}
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "white",
                    marginBottom: "4px",
                  }}
                >
                  {outfitter.name}
                </h3>
                <p style={{ fontSize: "12px", color: "#8B8478", marginBottom: "8px" }}>
                  📍 {outfitter.location}, {outfitter.province}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <span style={{ color: "#E8763A", fontSize: "12px" }}>
                    {"★".repeat(Math.round(outfitter.rating))}
                    {"☆".repeat(5 - Math.round(outfitter.rating))}
                  </span>
                  <span style={{ color: "#8B8478", fontSize: "11px" }}>
                    {outfitter.rating} ({outfitter.reviewCount})
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "10px" }}>
                  {outfitter.species.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      style={{
                        background: "rgba(196,90,26,0.15)",
                        border: "1px solid rgba(196,90,26,0.3)",
                        color: "#E8763A",
                        fontSize: "10px",
                        padding: "2px 8px",
                        borderRadius: "20px",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#E8763A", fontWeight: "700", fontSize: "14px" }}>
                    ${outfitter.pricePerDay}/day
                  </span>
                  <button
                    style={{
                      background: "linear-gradient(135deg, #C45A1A, #E8763A)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    View Hunt →
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
