import React, { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Compass, Check, AlertCircle } from "lucide-react";

// Default coordinate center: Sohna, Haryana
const DEFAULT_CENTER = { lat: 28.2468, lng: 77.0617 };

export function LocationPickerMap({
  initialLocation = "",
  initialCoords = null,
  onLocationSelected,
  lang = "English"
}) {
  const isHi = lang === "हिन्दी";
  const mapContainerRef = useRef(null);
  const [coords, setCoords] = useState(initialCoords || DEFAULT_CENTER);
  const [address, setAddress] = useState(initialLocation || "Sohna Bus Stand Chowk, Ward 4, Sohna, Haryana");
  const [isLocating, setIsLocating] = useState(false);
  const [mapEngine, setMapEngine] = useState("loading"); // 'google' | 'leaflet' | 'loading'

  const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Initialize Map Engine (Google Maps or OpenStreetMap/Leaflet fallback)
  useEffect(() => {
    let leafletMapInstance = null;
    let leafletMarker = null;

    if (googleKey && typeof window !== "undefined") {
      // Load Google Maps API lazily
      if (!window.google?.maps) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => initGoogleMap();
        script.onerror = () => initLeafletFallback();
        document.head.appendChild(script);
      } else {
        initGoogleMap();
      }
    } else {
      initLeafletFallback();
    }

    function initGoogleMap() {
      if (!mapContainerRef.current || !window.google?.maps) return;
      try {
        const gMap = new window.google.maps.Map(mapContainerRef.current, {
          center: coords,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        });

        const marker = new window.google.maps.Marker({
          position: coords,
          map: gMap,
          draggable: true,
          title: "Drag to pin exact grievance location"
        });

        marker.addListener("dragend", () => {
          const pos = marker.getPosition();
          const newCoords = { lat: pos.lat(), lng: pos.lng() };
          setCoords(newCoords);
          reverseGeocode(newCoords.lat, newCoords.lng);
        });

        setMapEngine("google");
      } catch (e) {
        initLeafletFallback();
      }
    }

    function initLeafletFallback() {
      // Inject Leaflet CSS & JS dynamically
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!window.L) {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => renderLeaflet();
        document.head.appendChild(script);
      } else {
        renderLeaflet();
      }
    }

    function renderLeaflet() {
      if (!mapContainerRef.current || !window.L) return;
      try {
        if (mapContainerRef.current._leaflet_id) {
          mapContainerRef.current._leaflet_id = null;
          mapContainerRef.current.innerHTML = "";
        }

        leafletMapInstance = window.L.map(mapContainerRef.current, {
          center: [coords.lat, coords.lng],
          zoom: 15,
          attributionControl: false
        });

        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19
        }).addTo(leafletMapInstance);

        leafletMarker = window.L.marker([coords.lat, coords.lng], {
          draggable: true
        }).addTo(leafletMapInstance);

        leafletMarker.on("dragend", (e) => {
          const latlng = e.target.getLatLng();
          const newCoords = { lat: latlng.lat, lng: latlng.lng };
          setCoords(newCoords);
          reverseGeocode(newCoords.lat, newCoords.lng);
        });

        setMapEngine("leaflet");
      } catch (err) {
        console.warn("Leaflet init error:", err);
      }
    }

    return () => {
      if (leafletMapInstance) {
        leafletMapInstance.remove();
      }
    };
  }, [googleKey]);

  // Reverse Geocoding using OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      if (res.ok) {
        const data = await res.json();
        const display = data.display_name?.split(",").slice(0, 4).join(",") || `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        setAddress(display);
        onLocationSelected({ address: display, lat, lng });
      }
    } catch (e) {
      const fallbackAddr = `Location Pin (${lat.toFixed(4)}, ${lng.toFixed(4)}), Sohna`;
      setAddress(fallbackAddr);
      onLocationSelected({ address: fallbackAddr, lat, lng });
    }
  };

  // Browser Geolocation API
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(newCoords);
        reverseGeocode(newCoords.lat, newCoords.lng);
        setIsLocating(false);
      },
      (err) => {
        console.warn("Geolocation denied/error:", err);
        setIsLocating(false);
        // Fallback to default Sohna
        setCoords(DEFAULT_CENTER);
        setAddress("Near Bus Stand Chowk, Sohna, Haryana (Default)");
        onLocationSelected({ address: "Near Bus Stand Chowk, Sohna, Haryana", ...DEFAULT_CENTER });
      },
      { timeout: 8000 }
    );
  };

  return (
    <div style={{ margin: "16px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-heading)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
          <MapPin size={14} color="var(--blue)" />
          <span>Interactive Location Pin (Map)</span>
        </label>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          style={{ background: "transparent", border: "none", color: "var(--blue)", fontSize: "12px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px", cursor: "pointer" }}
        >
          <Navigation size={13} />
          <span>{isLocating ? "Detecting GPS..." : (isHi ? "मेरा जीपीएस स्थान लें" : "Use My Location")}</span>
        </button>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "220px",
          borderRadius: "14px",
          border: "1px solid var(--line)",
          overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
          background: "var(--panel2)"
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", fontSize: "11px", color: "var(--muted)" }}>
        <span>📍 Drag marker to adjust exact street or pole location</span>
        <span>Engine: {mapEngine === "google" ? "Google Maps" : "OpenStreetMap (Verified)"}</span>
      </div>
    </div>
  );
}
