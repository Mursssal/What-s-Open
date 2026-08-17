import { useEffect, useState } from "react";

/**
 * Wraps the browser Geolocation API.
 * Returns { position, error, loading }.
 * position is { lat, lng } once resolved.
 */
export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation isn't supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Couldn't get your location.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { position, error, loading };
}
