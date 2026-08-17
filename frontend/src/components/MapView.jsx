import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

// Leaflet's default marker icons reference image files that don't bundle
// correctly with Vite — build our own lightweight divIcons instead.
function makeIcon(color) {
  return L.divIcon({
    className: "map-pin",
    html: `<span style="background:${color}"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

const userIcon = makeIcon("#4d9fff");
const openIcon = makeIcon("#3ddc84");
const closedIcon = makeIcon("#ff5d6c");

function Recenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView([position.lat, position.lng], map.getZoom());
  }, [position, map]);
  return null;
}

export default function MapView({ userPosition, places, selectedId, onSelect }) {
  if (!userPosition) return null;

  return (
    <MapContainer
      center={[userPosition.lat, userPosition.lng]}
      zoom={15}
      className="map-container"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter position={userPosition} />

      <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={place.open_now ? openIcon : closedIcon}
          eventHandlers={{ click: () => onSelect(place) }}
        >
          <Popup>
            <strong>{place.name}</strong>
            <br />
            {place.open_now ? "Open now" : "Closed"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
