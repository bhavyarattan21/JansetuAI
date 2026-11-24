import React, { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Search, Check, AlertCircle, Sparkles, CheckCircle2, X, Compass } from "lucide-react";

// Default coordinate center: New Delhi (National Capital Territory), India
export const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 };

// Popular Indian Civic Hubs for 1-Click Pinning
export const POPULAR_LOCATIONS = [
  {
    label: "Delhi (CP)",
    address: "Connaught Place, New Delhi, Delhi",
    lat: 28.6315,
    lng: 77.2167
  },
  {
    label: "Gurugram",
    address: "Cyber City, DLF Phase 2, Gurugram, Haryana",
    lat: 28.4900,
    lng: 77.0888
  },
  {
    label: "Mumbai",
    address: "Bandra Kurla Complex (BKC), Mumbai, Maharashtra",
    lat: 19.0657,
    lng: 72.8687
  },
  {
    label: "Bengaluru",
    address: "MG Road, Central Business District, Bengaluru, Karnataka",
    lat: 12.9756,
    lng: 77.6066
  },
  {
    label: "Lucknow",
    address: "Hazratganj, Central Lucknow, Uttar Pradesh",
    lat: 26.8467,
    lng: 80.9462
  },
  {
    label: "Jaipur",
    address: "MI Road, Pink City, Jaipur, Rajasthan",
    lat: 26.9124,
    lng: 75.7873
  },
  {
    label: "Sohna",
    address: "Bus Stand Chowk, Sohna, Haryana",
    lat: 28.2468,
    lng: 77.0617
  }
];

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
  const [address, setAddress] = useState(initialLocation || "New Delhi, Delhi");
  const [isLocating, setIsLocating] = useState(false);
  const [mapEngine, setMapEngine] = useState("loading"); // 'google' | 'leaflet' | 'loading'
  const [justSelected, setJustSelected] = useState(false);

  // Search Bar State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Sync external coords changes
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

  // Format parsed Nominatim / BigDataCloud payload into clean Indian / Universal address
  const formatAddressPayload = (data, lat, lng) => {
    if (!data) return `Civic Point (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`;

    // Handle OpenStreetMap Nominatim structure
    if (data.address) {
      const a = data.address;
      const landmark = a.amenity || a.building || a.shop || a.historic || a.leisure || a.office;
      const road = a.road || a.pedestrian || a.street;
      const locality = a.neighbourhood || a.suburb || a.residential || a.colony || a.sector;
      const city = a.city || a.town || a.city_district || a.county || a.village || a.municipality || a.state_district;
      const state = a.state;

      const segments = [];
      if (landmark) segments.push(landmark);
      if (road && road !== landmark) segments.push(road);
      if (locality && locality !== road) segments.push(locality);
      if (city) segments.push(city);
      if (state && (!city || !city.includes(state))) segments.push(state);

      if (segments.length > 0) {
        return `${segments.join(", ")} (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`;
      }
      if (data.display_name) {
        const parts = data.display_name.split(",").map(p => p.trim()).filter(Boolean);
        const concise = parts.slice(0, 3).join(", ");
        return `${concise} (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`;
      }
    }

    // Handle BigDataCloud fallback structure
    if (data.locality || data.city || data.principalSubdivision) {
      const bParts = [data.locality, data.city, data.principalSubdivision].filter(Boolean);
      return `${bParts.join(", ")} (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`;
    }

    return `Coordinates (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`;
  };

  // Reverse Geocoding: Tries Nominatim with rapid timeout, falls back to BigDataCloud client API
  const reverseGeocode = async (lat, lng) => {
    // 1. Try OpenStreetMap Nominatim
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
        const display = formatAddressPayload(data, lat, lng);
        setAddress(display);
        onLocationSelected?.({ address: display, lat, lng });
        return;
      }
    } catch (e) {
      // Proceed to secondary fallback
    }

    // 2. High-speed client fallback via BigDataCloud (CORS enabled, no API key needed)
    try {
      const res2 = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      if (res2.ok) {
        const data2 = await res2.json();
        const display2 = formatAddressPayload(data2, lat, lng);
        setAddress(display2);
        onLocationSelected?.({ address: display2, lat, lng });
        return;
      }
    } catch (e) {}

    // 3. Fallback coordinates string
    const fallbackDisplay = `Civic Point (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`;
    setAddress(fallbackDisplay);
    onLocationSelected?.({ address: fallbackDisplay, lat, lng });
  };

  // Handle user selecting a point on the map
  const handlePointSelection = (lat, lng) => {
    const newCoords = { lat, lng };
    setCoords(newCoords);

    // Instant optimistic coordinates badge
    const instantDisplay = `Civic Pin (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`;
    setAddress(instantDisplay);
    setJustSelected(true);
    setTimeout(() => setJustSelected(false), 3000);

    onLocationSelected?.({ address: instantDisplay, lat, lng });
    reverseGeocode(lat, lng);
  };

  // Programmatically update map view and marker position
  const updateMapPosition = (newLat, newLng, zoom = 15) => {
    if (leafletMapRef.current && leafletMarkerRef.current) {
      leafletMapRef.current.setView([newLat, newLng], zoom);
      leafletMarkerRef.current.setLatLng([newLat, newLng]);
    }
    if (googleMapRef.current && googleMarkerRef.current) {
      const gCoords = new window.google.maps.LatLng(newLat, newLng);
      googleMapRef.current.panTo(gCoords);
      googleMapRef.current.setZoom(zoom);
      googleMarkerRef.current.setPosition(gCoords);
    }
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
          zoom: 14,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        });
        googleMapRef.current = gMap;

        const marker = new window.google.maps.Marker({
          position: coords,
          map: gMap,
          draggable: true,
          title: "Drag to pin exact grievance location"
        });
        googleMarkerRef.current = marker;

        marker.addListener("dragend", () => {
          const pos = marker.getPosition();
          handlePointSelection(pos.lat(), pos.lng());
        });

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
          zoom: 14,
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

        setTimeout(() => {
          mapInstance.invalidateSize();
        }, 200);

        marker.on("dragend", (e) => {
          const latlng = e.target.getLatLng();
          handlePointSelection(latlng.lat, latlng.lng);
        });

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

  // Robust 2-Stage "Use My Location" (High-Accuracy GPS with Instant Wi-Fi/IP Fallback)
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(isHi ? "आपके ब्राउज़र में जीपीएस सेवा उपलब्ध नहीं है।" : "Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);

    const onGpsSuccess = (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const newCoords = { lat, lng };
      setCoords(newCoords);
      updateMapPosition(lat, lng, 16);

      const instantDisplay = `Detected Location (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`;
      setAddress(instantDisplay);
      setJustSelected(true);
      setTimeout(() => setJustSelected(false), 3000);

      onLocationSelected?.({ address: instantDisplay, lat, lng });
      reverseGeocode(lat, lng);
      setIsLocating(false);
    };

    const onGpsError = (err) => {
      console.warn("High-accuracy GPS timed out or failed, falling back to network IP location:", err);
      // Fallback to low-accuracy (Wi-Fi / cellular / IP triangulation, instant on desktop)
      navigator.geolocation.getCurrentPosition(
        onGpsSuccess,
        (secondErr) => {
          console.warn("All geolocation attempts failed:", secondErr);
          setIsLocating(false);
          alert(
            isHi
              ? "जीपीएस स्थान नहीं मिल सका। कृपया अपने ब्राउज़र में लोकेशन अनुमति (Allow Location) सक्षम करें।"
              : "Unable to retrieve your current location. Please check browser location permissions or type your area in the search bar below."
          );
        },
        { enableHighAccuracy: false, timeout: 7000 }
      );
    };

    navigator.geolocation.getCurrentPosition(
      onGpsSuccess,
      onGpsError,
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 30000 }
    );
  };

  // Search Address or Landmark across India / Worldwide
  const handleSearchSubmit = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`
      );
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const first = results[0];
          const lat = parseFloat(first.lat);
          const lng = parseFloat(first.lon);
          const newCoords = { lat, lng };
          setCoords(newCoords);
          updateMapPosition(lat, lng, 15);

          const display = formatAddressPayload(first, lat, lng);
          setAddress(display);
          setJustSelected(true);
          setTimeout(() => setJustSelected(false), 3000);

          onLocationSelected?.({ address: display, lat, lng });
          setSearchResults(results.length > 1 ? results : []);
        } else {
          alert(isHi ? "स्थान नहीं मिला। कृपया अलग नाम से खोजें।" : "Location not found. Please try another area or city name.");
        }
      }
    } catch (err) {
      console.warn("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Select a preset location
  const handleSelectPreset = (loc) => {
    setCoords({ lat: loc.lat, lng: loc.lng });
    setAddress(loc.address);
    updateMapPosition(loc.lat, loc.lng, 15);
    setJustSelected(true);
    setTimeout(() => setJustSelected(false), 3000);
    onLocationSelected?.({ address: loc.address, lat: loc.lat, lng: loc.lng });
  };

  return (
    <div style={{ display: "grid", gap: "12px" }}>
      {/* Top Header: Title & "Use My Location" GPS Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <MapPin size={16} color="var(--blue)" />
          <strong style={{ fontSize: "13px", color: "var(--text-heading)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {isHi ? "अखिल भारतीय इंटरएक्टिव मानचित्र" : "Interactive Map (Pan-India & Global)"}
          </strong>
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          style={{
            background: isLocating ? "rgba(37, 99, 235, 0.2)" : "rgba(37, 99, 235, 0.12)",
            border: "1px solid var(--blue)",
            color: "var(--blue)",
            borderRadius: "8px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            cursor: isLocating ? "wait" : "pointer",
            transition: "all 0.15s ease",
            boxShadow: isLocating ? "0 0 10px rgba(37, 99, 235, 0.4)" : "none"
          }}
        >
          <Navigation size={14} className={isLocating ? "spin" : ""} />
          <span>{isLocating ? (isHi ? "जीपीएस खोज रहा है..." : "Detecting GPS...") : (isHi ? "🎯 मेरा जीपीएस स्थान लें" : "🎯 Use My Current Location")}</span>
        </button>
      </div>

      {/* Interactive Location Search Bar */}
      <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "6px", position: "relative" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={15} color="var(--muted)" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHi ? "भारत में कोई भी शहर, कॉलोनी, या लैंडमार्क खोजें (उदा. कनाट प्लेस, अंधेरी)..." : "Search any city, area, colony, or landmark (e.g. Connaught Place, Indiranagar)..."}
            style={{
              width: "100%",
              padding: "8px 12px 8px 32px",
              borderRadius: "8px",
              border: "1px solid var(--line)",
              background: "var(--panel-input)",
              color: "var(--text)",
              fontSize: "13px"
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(""); setSearchResults([]); }}
              style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px" }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isSearching}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            background: "var(--blue)",
            color: "#FFFFFF",
            border: "none",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          {isSearching ? <span className="spin">⟳</span> : <Search size={13} />}
          <span>{isHi ? "खोजें" : "Search"}</span>
        </button>
      </form>

      {/* Optional Search Results Dropdown */}
      {searchResults.length > 0 && (
        <div style={{
          maxHeight: "150px",
          overflowY: "auto",
          background: "var(--panel2)",
          border: "1px solid var(--line)",
          borderRadius: "8px",
          padding: "4px"
        }}>
          {searchResults.map((r, i) => (
            <div
              key={i}
              onClick={() => {
                const lat = parseFloat(r.lat);
                const lng = parseFloat(r.lon);
                setCoords({ lat, lng });
                updateMapPosition(lat, lng, 15);
                const display = formatAddressPayload(r, lat, lng);
                setAddress(display);
                onLocationSelected?.({ address: display, lat, lng });
                setSearchResults([]);
              }}
              style={{
                padding: "6px 10px",
                fontSize: "12px",
                cursor: "pointer",
                borderRadius: "6px",
                borderBottom: i < searchResults.length - 1 ? "1px solid var(--line)" : "none",
                color: "var(--text)"
              }}
            >
              📍 {r.display_name}
            </div>
          ))}
        </div>
      )}

      {/* Map Canvas with Floating Helper and Feedback */}
      <div style={{ position: "relative" }}>
        <div
          ref={mapContainerRef}
          style={{
            width: "100%",
            height: "250px",
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
              <span style={{ color: "#34D399" }}>{isHi ? "स्थान फॉर्म में जोड़ा गया!" : "Location updated in form!"}</span>
            </>
          ) : (
            <>
              <MapPin size={12} color="var(--blue)" />
              <span>{isHi ? "मानचित्र पर कहीं भी क्लिक करें या पिन खींचें" : "Click anywhere on map or drag pin anywhere"}</span>
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
        padding: "6px 10px",
        background: "var(--panel-input)",
        borderRadius: "8px",
        border: "1px solid var(--line)"
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text)" }}>
          <CheckCircle2 size={13} color="#10B981" />
          <span>{isHi ? "सक्रिय पिन:" : "Pinned Address:"}</span>
          <strong style={{ color: "var(--text-heading)", maxWidth: "320px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {address}
          </strong>
        </span>
        <span style={{ fontFamily: "monospace", color: "var(--blue)", fontWeight: 700 }}>
          {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
        </span>
      </div>

      {/* Quick Civic City / Area Presets */}
      <div>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "6px", textTransform: "uppercase" }}>
          {isHi ? "त्वरित शहर / क्षेत्र चुनें:" : "Quick Region Presets (Click to Jump):"}
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {POPULAR_LOCATIONS.map((loc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(loc)}
              style={{
                background: Math.hypot(coords.lat - loc.lat, coords.lng - loc.lng) < 0.05 ? "var(--blue)" : "var(--panel)",
                border: Math.hypot(coords.lat - loc.lat, coords.lng - loc.lng) < 0.05 ? "1px solid var(--blue)" : "1px solid var(--line)",
                color: Math.hypot(coords.lat - loc.lat, coords.lng - loc.lng) < 0.05 ? "#FFFFFF" : "var(--text)",
                borderRadius: "20px",
                padding: "4px 10px",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              📍 {loc.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
