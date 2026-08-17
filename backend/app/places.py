"""
Thin wrapper around the Google Places API (Nearby Search, New).

Docs: https://developers.google.com/maps/documentation/places/web-service/nearby-search
"""
import os
import requests
from typing import Optional

GOOGLE_API_KEY = os.environ.get("GOOGLE_PLACES_API_KEY", "")

NEARBY_SEARCH_URL = "https://places.googleapis.com/v1/places:searchNearby"

# Maps our friendly category names -> Google Places "included types".
# Full list: https://developers.google.com/maps/documentation/places/web-service/place-types
CATEGORY_MAP = {
    "restaurant": ["restaurant"],
    "cafe": ["cafe", "coffee_shop"],
    "pharmacy": ["pharmacy"],
    "grocery": ["grocery_store", "supermarket"],
    "bar": ["bar"],
    "gas_station": ["gas_station"],
    "hospital": ["hospital"],
    "atm_bank": ["atm", "bank"],
}

# Fields we ask Google for — keep this minimal to control cost.
# See "Nearby Search (New) SKU" pricing: fewer fields = cheaper tier.
FIELD_MASK = ",".join([
    "places.id",
    "places.displayName",
    "places.formattedAddress",
    "places.location",
    "places.currentOpeningHours.openNow",
    "places.rating",
    "places.userRatingCount",
    "places.primaryType",
    "places.priceLevel",
])


def search_nearby_places(
    lat: float,
    lng: float,
    radius: int,
    category: str,
    open_now_only: bool = True,
) -> list[dict]:
    if not GOOGLE_API_KEY:
        raise RuntimeError(
            "GOOGLE_PLACES_API_KEY is not set on the server. "
            "Add it to backend/.env — see README for how to get one."
        )

    body: dict = {
        "locationRestriction": {
            "circle": {
                "center": {"latitude": lat, "longitude": lng},
                "radius": radius,
            }
        },
        "maxResultCount": 20,
    }

    if category != "all":
        body["includedTypes"] = CATEGORY_MAP[category]

    if open_now_only:
        # New Places API doesn't support server-side open_now filtering on
        # searchNearby directly, so we filter client-side below after fetching.
        pass

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": FIELD_MASK,
    }

    resp = requests.post(NEARBY_SEARCH_URL, json=body, headers=headers, timeout=10)

    if resp.status_code != 200:
        raise RuntimeError(f"Google Places API error ({resp.status_code}): {resp.text}")

    data = resp.json()
    places = data.get("places", [])

    results = []
    for p in places:
        is_open = (p.get("currentOpeningHours") or {}).get("openNow")
        if open_now_only and is_open is not True:
            continue
        results.append({
            "id": p.get("id"),
            "name": (p.get("displayName") or {}).get("text", "Unknown"),
            "address": p.get("formattedAddress"),
            "lat": (p.get("location") or {}).get("latitude"),
            "lng": (p.get("location") or {}).get("longitude"),
            "open_now": is_open,
            "rating": p.get("rating"),
            "rating_count": p.get("userRatingCount"),
            "primary_type": p.get("primaryType"),
            "price_level": p.get("priceLevel"),
        })

    return results
