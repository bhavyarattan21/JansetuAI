import React, { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Compass, Check, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";

// Default coordinate center: Sohna, Haryana
export const DEFAULT_CENTER = { lat: 28.2468, lng: 77.0617 };

// Realistic Sohna Civic Landmarks for 1-click Pinning
export const SOHNA_LANDMARKS = [
  {
    label: "Bus Stand Chowk",
    address: "Near Sohna Bus Stand Chowk, Ward 4, Sohna, Haryana",
    lat: 28.2468,
    lng: 77.0617
  },
  {
    label: "Shiv Kund",
    address: "Historical Shiv Kund, Old City, Ward 2, Sohna, Haryana",
    lat: 28.2492,
    lng: 77.0645
  },
  {
    label: "Ward 7 School Road",
    address: "Opposite Govt Girls Sr. Sec. School, Ward 7, Sohna, Haryana",
    lat: 28.2435,
    lng: 77.0589
  },
  {
    label: "Alwar Highway",
    address: "Sohna-Alwar Highway Corridor, Near Bypass Chowk, Sohna, Haryana",
    lat: 28.2515,
    lng: 77.0602
  },
  {
    label: "Municipal Office",
    address: "Near Municipal Committee Office, Ward 5, Sohna, Haryana",
    lat: 28.2450,
    lng: 77.0630
  }
];

// Instant Euclidean nearest landmark finder (0ms instant calculation)
export function getNearestLandmark(lat, lng) {
  let nearest = SOHNA_LANDMARKS[0];
  let minDistance = Infinity;
  for (const lm of SOHNA_LANDMARKS) {
    const d = Math.hypot(lm.lat - lat, lm.lng - lng);
    if (d < minDistance) {
      minDistance = d;
      nearest = lm;
    }
  }
  return nearest;
}

export function LocationPickerMap({
  initialLocation = "",
  initialCoords = null,
  onLocationSelected,
  lang = "English"
}) {
  const isHi = lang === "हिन्दी";
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const leafletMarkerRef = useRef(null);
  const googleMapRef = useRef(null);
  const googleMarkerRef = useRef(null);

  const [coords, setCoords] = useState(initialCoords || DEFAULT_CENTER);
  const [address, setAddress] = useState(initialLocation || SOHNA_LANDMARKS[0].address);
  const [isLocating, setIsLocating] = useState(false);
  const [mapEngine, setMapEngine] = useState("loading"); // 'google' | 'leaflet' | 'loading'
  const [justSelected, setJustSelected] = useState(false);

  const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Sync external coords changes (e.g. from parent landmark chips or GPS button)
  useEffect(() => {
    if (initialCoords && (Math.abs(initialCoords.lat - coords.lat) > 0.0001 || Math.abs(initialCoords.lng - coords.lng) > 0.0001)) {
      setCoords(initialCoords);
      updateMapPosition(initialCoords.lat, initialCoords.lng);
    }
  }, [initialCoords?.lat, initialCoords?.lng]);

  // Sync external location string changes
  useEffect(() => {
    if (initialLocation && initialLocation !== address) {
      setAddress(initialLocation);
    }
  }, [initialLocation]);

  // Handle user selecting a point on the map
  const handlePointSelection = (lat, lng) => {
    const newCoords = { lat, lng };
    setCoords(newCoords);

    // 1. Instant 0ms optimistic address from nearest landmark
    const nearest = getNearestLandmark(lat, lng);
    const instantDisplay = Math.hypot(nearest.lat - lat, nearest.lng - lng) < 0.003
      ? `Near ${nearest.label}, Sohna, Haryana (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`
      : `Civic Point (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E), Near ${nearest.label}, Sohna, Haryana`;

    setAddress(instantDisplay);
    setJustSelected(true);
    setTimeout(() => setJustSelected(false), 3000);

    // Immediately notify parent so the Location/Landmark field updates with zero delay!
    onLocationSelected?.({ address: instantDisplay, lat, lng });

    // 2. Background reverse geocoding to refine street details if available
    reverseGeocode(lat, lng, instantDisplay);
  };

  // Initialize Map Engine (Google Maps or Leaflet OpenStreetMap)
  useEffect(() => {
    if (googleKey && typeof window !== "undefined") {
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
        googleMapRef.current = gMap;

        const marker = new window.google.maps.Marker({
          position: coords,
          map: gMap,
          draggable: true,
          title: "Click or drag to pin exact grievance location"
        });
        googleMarkerRef.current = marker;

        // Move marker on drag
        marker.addListener("dragend", () => {
          const pos = marker.getPosition();
          handlePointSelection(pos.lat(), pos.lng());
        });

        // Click anywhere on Google Map to move pin
        gMap.addListener("click", (e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          marker.setPosition({ lat, lng });
          handlePointSelection(lat, lng);
        });

        setMapEngine("google");
      } catch (e) {
        initLeafletFallback();
      }
    }

    function initLeafletFallback() {
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

        const mapInstance = window.L.map(mapContainerRef.current, {
          center: [coords.lat, coords.lng],
          zoom: 15,
          attributionControl: false
        });
        leafletMapRef.current = mapInstance;

        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19
        }).addTo(mapInstance);

        const marker = window.L.marker([coords.lat, coords.lng], {
          draggable: true,
          title: "Drag to set exact civic location"
        }).addTo(mapInstance);
        leafletMarkerRef.current = marker;

        // Invalidate map size so tiles load cleanly
        setTimeout(() => {
          mapInstance.invalidateSize();
        }, 200);

        // Move marker on drag
        marker.on("dragend", (e) => {
          const latlng = e.target.getLatLng();
          handlePointSelection(latlng.lat, latlng.lng);
        });

        // Click anywhere on Leaflet map to move pin immediately!
        mapInstance.on("click", (e) => {
          const latlng = e.latlng;
          marker.setLatLng(latlng);
          handlePointSelection(latlng.lat, latlng.lng);
        });

        setMapEngine("leaflet");
      } catch (err) {
        console.warn("Leaflet init error:", err);
      }
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [googleKey]);

  // Programmatically update map view and marker position
  const updateMapPosition = (newLat, newLng) => {
    if (leafletMapRef.current && leafletMarkerRef.current) {
      leafletMapRef.current.setView([newLat, newLng], 16);
      leafletMarkerRef.current.setLatLng([newLat, newLng]);
    }
    if (googleMapRef.current && googleMarkerRef.current) {
      const gCoords = new window.google.maps.LatLng(newLat, newLng);
      googleMapRef.current.panTo(gCoords);
      googleMarkerRef.current.setPosition(gCoords);
    }
  };

  // Reverse Geocoding with timeout and enrichment
  const reverseGeocode = async (lat, lng, fallback) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        const road = data.address?.road || data.address?.pedestrian || data.address?.neighbourhood;
        const area = data.address?.suburb || data.address?.city_district || data.address?.town || "Sohna";
        if (road || area) {
          const display = `${road ? road + ", " : ""}${area}, Sohna (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`;
          setAddress(display);
          onLocationSelected?.({ address: display, lat, lng });
        }
      }
    } catch (e) {
      // Immediate fallback already set!
    }
  };

  // Select a preset landmark
  const handleSelectPreset = (landmark) => {
    setCoords({ lat: landmark.lat, lng: landmark.lng });
    setAddress(landmark.address);
    updateMapPosition(landmark.lat, landmark.lng);
    setJustSelected(true);
    setTimeout(() => setJustSelected(false), 3000);
    onLocationSelected?.({ address: landmark.address, lat: landmark.lat, lng: landmark.lng });
  };

  // Browser GPS Geolocation API
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
        updateMapPosition(newCoords.lat, newCoords.lng);
        handlePointSelection(newCoords.lat, newCoords.lng);
        setIsLocating(false);
      },
      (err) => {
        console.warn("Geolocation denied/error:", err);
        setIsLocating(false);
        handleSelectPreset(SOHNA_LANDMARKS[0]);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div style={{ display: "grid", gap: "10px" }}>
      {/* Map Header with GPS Action */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <MapPin size={16} color="var(--blue)" />
          <strong style={{ fontSize: "13px", color: "var(--text-heading)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {isHi ? "इंटरएक्टिव लोकेशन पिन (क्लिक करें)" : "Interactive Map (Click to Set Location)"}
          </strong>
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          style={{
            background: "rgba(37, 99, 235, 0.12)",
            border: "1px solid var(--blue)",
            color: "var(--blue)",
            borderRadius: "6px",
            padding: "4px 10px",
            fontSize: "12px",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          <Navigation size={13} />
          <span>{isLocating ? (isHi ? "जीपीएस खोज रहा है..." : "Detecting GPS...") : (isHi ? "मेरा जीपीएस स्थान लें" : "Use My Location")}</span>
        </button>
      </div>

      {/* Map Canvas with Floating Helper and Feedback */}
      <div style={{ position: "relative" }}>
        <div
          ref={mapContainerRef}
          style={{
            width: "100%",
            height: "230px",
            borderRadius: "14px",
            border: justSelected ? "2px solid #10B981" : "1px solid var(--line)",
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)",
            background: "var(--panel2)",
            position: "relative",
            zIndex: 1,
            transition: "border-color 0.25s ease"
          }}
        />

        {/* Floating Helper Banner */}
        <div style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 400,
          background: "rgba(15, 23, 42, 0.88)",
          backdropFilter: "blur(6px)",
          color: "#FFFFFF",
          padding: "5px 12px",
          borderRadius: "20px",
          fontSize: "11px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          pointerEvents: "none",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.35)",
          whiteSpace: "nowrap"
        }}>
          {justSelected ? (
            <>
              <CheckCircle2 size={13} color="#10B981" />
              <span style={{ color: "#34D399" }}>{isHi ? "स्थान फील्ड में जोड़ा गया!" : "Location added to Location / Landmark!"}</span>
            </>
          ) : (
            <>
              <MapPin size={12} color="var(--blue)" />
              <span>{isHi ? "नक्शे पर कहीं भी क्लिक करें या पिन खींचें" : "Click anywhere on map to update Location"}</span>
            </>
          )}
        </div>
      </div>

      {/* Active Coordinates & Location Sync Feedback */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "11px",
        color: "var(--muted)",
        flexWrap: "wrap",
        gap: "6px",
        padding: "4px 8px",
        background: "var(--panel-input)",
        borderRadius: "8px",
        border: "1px solid var(--line)"
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text)" }}>
          <CheckCircle2 size={12} color="#10B981" />
          <span>{isHi ? "चयनित:" : "Active Pin:"}</span>
          <strong style={{ color: "var(--text-heading)", maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {address}
          </strong>
        </span>
        <span style={{ fontFamily: "monospace", color: "var(--blue)", fontWeight: 700 }}>
          {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
        </span>
      </div>

      {/* 1-Click Quick Landmark Presets */}
      <div>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "6px", textTransform: "uppercase" }}>
          {isHi ? "त्वरित सोहना लैंडमार्क चुनें:" : "Quick Landmark Presets (Sohna):"}
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {SOHNA_LANDMARKS.map((lm, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(lm)}
              style={{
                background: Math.hypot(coords.lat - lm.lat, coords.lng - lm.lng) < 0.001 ? "var(--blue)" : "var(--panel)",
                border: Math.hypot(coords.lat - lm.lat, coords.lng - lm.lng) < 0.001 ? "1px solid var(--blue)" : "1px solid var(--line)",
                color: Math.hypot(coords.lat - lm.lat, coords.lng - lm.lng) < 0.001 ? "#FFFFFF" : "var(--text)",
                borderRadius: "20px",
                padding: "4px 10px",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              📍 {lm.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
