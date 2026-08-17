import { useEffect, useState, useCallback } from "react";
import { useGeolocation } from "./hooks/useGeolocation";
import { searchNearby } from "./lib/api";
import CategoryFilter from "./components/CategoryFilter";
import PlaceList from "./components/PlaceList";
import MapView from "./components/MapView";
import "./App.css";

export default function App() {
  const { position, error: geoError, loading: geoLoading } = useGeolocation();

  const [category, setCategory] = useState("all");
  const [radius, setRadius] = useState(1500);
  const [openNowOnly, setOpenNowOnly] = useState(true);

  const [places, setPlaces] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runSearch = useCallback(async () => {
    if (!position) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchNearby({
        lat: position.lat,
        lng: position.lng,
        category,
        radius,
        openNowOnly,
      });
      setPlaces(data.results);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [position, category, radius, openNowOnly]);

  useEffect(() => {
    runSearch();
  }, [runSearch]);

  const selectedPlace = places.find((p) => p.id === selectedId) || null;

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-sign">
            <span className="brand-dot" />
            What's Open
          </span>
          <span className="brand-tag">find what's open, right now</span>
        </div>

        <CategoryFilter active={category} onChange={setCategory} />

        <div className="controls">
          <label className="radius-control">
            Radius: {radius >= 1000 ? `${(radius / 1000).toFixed(1)} km` : `${radius} m`}
            <input
              type="range"
              min="200"
              max="5000"
              step="100"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            />
          </label>

          <label className="toggle-control">
            <input
              type="checkbox"
              checked={openNowOnly}
              onChange={(e) => setOpenNowOnly(e.target.checked)}
            />
            Open now only
          </label>
        </div>
      </header>

      <main className="app-main">
        <aside className="sidebar">
          {geoLoading && <div className="list-state">Finding you…</div>}
          {geoError && (
            <div className="list-state list-state--error">
              Location access is needed to find nearby places. {geoError}
            </div>
          )}
          {!geoLoading && !geoError && (
            <PlaceList
              places={places}
              userPosition={position}
              selectedId={selectedId}
              onSelect={(p) => setSelectedId(p.id)}
              loading={loading}
              error={error}
            />
          )}
        </aside>

        <section className="map-pane">
          {position ? (
            <MapView
              userPosition={position}
              places={places}
              selectedId={selectedId}
              onSelect={(p) => setSelectedId(p.id)}
            />
          ) : (
            <div className="map-placeholder">
              {geoLoading ? "Waiting for your location…" : "Location unavailable."}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
