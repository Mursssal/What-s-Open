import StatusBadge from "./StatusBadge";

function formatDistance(km) {
  if (km == null) return null;
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

export default function PlaceCard({ place, distanceKm, selected, onSelect }) {
  return (
    <li>
      <button
        className={`place-card ${selected ? "is-selected" : ""}`}
        onClick={() => onSelect(place)}
      >
        <div className="place-card__main">
          <span className="place-card__name">{place.name}</span>
          <span className="place-card__address">{place.address}</span>
          <div className="place-card__meta">
            {place.rating != null && (
              <span className="place-card__rating">★ {place.rating.toFixed(1)}</span>
            )}
            {distanceKm != null && (
              <span className="place-card__distance">{formatDistance(distanceKm)} away</span>
            )}
          </div>
        </div>
        <StatusBadge open={place.open_now} />
      </button>
    </li>
  );
}
