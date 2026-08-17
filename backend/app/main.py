"""
What's Open — backend API

Exposes a single search endpoint that wraps Google Places API,
so the frontend never needs to see the API key.
"""
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from .places import search_nearby_places, CATEGORY_MAP

app = FastAPI(title="What's Open API", version="0.1.0")

# Allow the local Vite dev server (and later, your deployed frontend) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this to your real frontend URL before deploying
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/categories")
def get_categories():
    """Categories the frontend can filter by."""
    return {"categories": list(CATEGORY_MAP.keys())}


@app.get("/api/search")
def search(
    lat: float = Query(..., description="User latitude"),
    lng: float = Query(..., description="User longitude"),
    category: str = Query("all", description="One of /api/categories, or 'all'"),
    radius: int = Query(1500, ge=100, le=5000, description="Search radius in meters"),
    open_now_only: bool = Query(True, description="Only return currently-open places"),
):
    """
    Find nearby businesses, optionally filtered to a category and to
    places that are open right now.
    """
    if category != "all" and category not in CATEGORY_MAP:
        raise HTTPException(status_code=400, detail=f"Unknown category '{category}'")

    try:
        results = search_nearby_places(
            lat=lat,
            lng=lng,
            radius=radius,
            category=category,
            open_now_only=open_now_only,
        )
    except RuntimeError as e:
        # e.g. missing/invalid API key, upstream error
        raise HTTPException(status_code=502, detail=str(e))

    return {"count": len(results), "results": results}
