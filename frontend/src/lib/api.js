const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function searchNearby({ lat, lng, category = "all", radius = 1500, openNowOnly = true }) {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    category,
    radius: String(radius),
    open_now_only: String(openNowOnly),
  });

  const res = await fetch(`${API_BASE}/api/search?${params.toString()}`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Search failed (${res.status})`);
  }

  return res.json();
}

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "restaurant", label: "Restaurants" },
  { id: "cafe", label: "Cafés" },
  { id: "pharmacy", label: "Pharmacies" },
  { id: "grocery", label: "Grocery" },
  { id: "bar", label: "Bars" },
  { id: "gas_station", label: "Gas" },
  { id: "hospital", label: "Hospitals" },
  { id: "atm_bank", label: "ATM/Bank" },
];
