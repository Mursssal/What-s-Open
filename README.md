# What's Open

Find nearby businesses that are actually open right now — restaurants, cafés,
pharmacies, grocery stores, and more — on a live map.

## Stack

- **Backend**: FastAPI (Python) — proxies Google Places API so your API key never touches the browser
- **Frontend**: React + Vite, map rendered with Leaflet/OpenStreetMap (no Google Maps billing needed)
- **Data source**: Google Places API (New) — `searchNearby`, filtered to `open_now: true`

```
whats-open/
├── backend/
│   ├── app/
│   │   ├── main.py       # FastAPI routes
│   │   └── places.py     # Google Places API wrapper
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── components/    # MapView, PlaceList, PlaceCard, StatusBadge, CategoryFilter
    │   ├── hooks/          # useGeolocation
    │   └── lib/            # api.js, geo.js
    └── .env.example
```

## 1. Get a Google Places API key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/credentials)
2. Create a project (or pick an existing one)
3. Enable **"Places API (New)"** under APIs & Services
4. Create an API key under Credentials
5. (Recommended) restrict the key to the Places API and to your server's IP

Google gives a **$200/month free credit**, which comfortably covers a dev/small
personal project — but keep an eye on usage once you deploy publicly.

## 2. Run the backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# edit .env and paste in your GOOGLE_PLACES_API_KEY

uvicorn app.main:app --reload --port 8000
```

Check it's alive: open http://localhost:8000/api/health — should return `{"status": "ok"}`.
Interactive API docs are at http://localhost:8000/docs.

## 3. Run the frontend

```bash
cd frontend
npm install

cp .env.example .env
# defaults to http://localhost:8000, change VITE_API_BASE_URL if needed

npm run dev
```

Open the printed localhost URL (usually http://localhost:5173). Your browser
will ask for location permission — allow it to see nearby results.

## How it works

1. Browser geolocation gets your lat/lng (`useGeolocation` hook)
2. Frontend calls `GET /api/search?lat=...&lng=...&category=...&radius=...`
3. Backend calls Google's `places:searchNearby`, requesting only the fields we
   need (keeps the API call in a cheaper pricing tier), and filters to places
   where `currentOpeningHours.openNow === true`
4. Results render as pins on a Leaflet map and as cards in the sidebar,
   sorted by distance

## Known limitations / good next steps

- No caching — every filter change hits the Google API directly. Add a short
  TTL cache (Redis or in-memory) keyed by `lat,lng,category,radius` rounded to
  a grid, to cut costs.
- No pagination — Google returns up to 20 results per call; a "load more"
  using `nextPageToken` would extend this.
- No business detail page (photos, phone number, today's full hours) — the
  Places **Details** endpoint would add this for a selected place.
- No automated tests yet.
- CORS is wide open (`allow_origins=["*"]`) — lock this to your real frontend
  origin before deploying.
