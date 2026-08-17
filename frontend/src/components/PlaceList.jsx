import PlaceCard from "./PlaceCard";
import { distanceKm } from "../lib/geo";

export default function PlaceList({ places, userPosition, selectedId, onSelect, loading, error }) {
  if (loading) {
    return <div className="list-state">Scanning the neighborhood…</div>;
  }

  if (error) {
    return <div className="list-state list-state--error">{error}</div>;
  }

  if (places.length === 0) {
    return (
      <div className="list-state">
        Nothing open nearby right now. Try widening the radius or switching category.
      </div>
    );
  }

  const sorted = [...places].sort((a, b) => {
    const da = distanceKm(userPosition, { lat: a.lat, lng: a.lng }) ?? Infinity;
    const db = distanceKm(userPosition, { lat: b.lat, lng: b.lng }) ?? Infinity;
    return da - db;
  });

  return (
    <ul className="place-list">
      {sorted.map((place) => (
        <PlaceCard
          key={place.id}
          place={place}
          distanceKm={distanceKm(userPosition, { lat: place.lat, lng: place.lng })}
          selected={place.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
