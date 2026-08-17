# What's Open

Find nearby businesses that are actually open right now — restaurants, cafés,
pharmacies, grocery stores, and more — on a live map.

## Stack

- **Backend**: FastAPI (Python) — proxies Google Places API so your API key never touches the browser
- **Frontend**: React + Vite, map rendered with Leaflet/OpenStreetMap (no Google Maps billing needed)
- **Data source**: Google Places API (New) — `searchNearby`, filtered to `open_now: true`
