#!/usr/bin/env python3
"""
Rare Earth Fetcher — Global rare earth production, reserves, and quota data.
Sources: USGS Mineral Commodity Summaries, China MIIT quota announcements.
"""

import json
from pathlib import Path
from typing import List, Dict, Any

import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from scripts.utils.logger import setup_logging

logger = setup_logging("fetcher.rare_earth")

BASE_RE: List[Dict[str, Any]] = [
    {"id": "re1", "name": "China Rare Earth Reserves", "country": "China", "lat": 35.0, "lng": 105.0,
     "city": "Baotou", "reservesMt": 44.0, "globalShare": 38.0, "productionKt": 270.0,
     "quota2024Kt": 270, "lightReKt": 250, "heavyReKt": 20, "smeltingShare": 90,
     "layer": "supply", "category": "rare_earth", "exportControl": True,
     "sourceTier": 1, "lastUpdated": "2024-04-15", "sourceRef": "usgs.gov/mineral-commodities/rare-earths"},
    {"id": "re2", "name": "Brazil Rare Earth Reserves", "country": "Brazil", "lat": -14.2350, "lng": -51.9253,
     "city": "Serra Verde", "reservesMt": 22.0, "globalShare": 19.0, "productionKt": 0.5,
     "quota2024Kt": 0, "layer": "supply", "category": "rare_earth",
     "sourceTier": 1, "lastUpdated": "2024-04-15", "sourceRef": "usgs.gov"},
    {"id": "re3", "name": "India Rare Earth Reserves", "country": "India", "lat": 20.5937, "lng": 78.9629,
     "city": "Odisha", "reservesMt": 6.9, "globalShare": 6.0, "productionKt": 0.3,
     "quota2024Kt": 0, "layer": "supply", "category": "rare_earth",
     "sourceTier": 1, "lastUpdated": "2024-04-15", "sourceRef": "usgs.gov"},
    {"id": "re4", "name": "Australia Rare Earth Reserves", "country": "Australia", "lat": -25.2744, "lng": 133.7751,
     "city": "Mount Weld", "reservesMt": 5.7, "globalShare": 5.0, "productionKt": 20.0,
     "quota2024Kt": 0, "layer": "supply", "category": "rare_earth",
     "sourceTier": 1, "lastUpdated": "2024-04-15", "sourceRef": "usgs.gov"},
    {"id": "re5", "name": "USA Rare Earth Reserves", "country": "USA", "lat": 38.0, "lng": -109.0,
     "city": "Mountain Pass", "reservesMt": 1.9, "globalShare": 1.6, "productionKt": 45.0,
     "quota2024Kt": 0, "layer": "supply", "category": "rare_earth",
     "sourceTier": 1, "lastUpdated": "2024-04-15", "sourceRef": "usgs.gov"},
]


def fetch() -> List[Dict[str, Any]]:
    logger.info(f"Loading {len(BASE_RE)} rare earth records")
    for item in BASE_RE:
        item["_fetchTimestamp"] = __import__("time").strftime("%Y-%m-%dT%H:%M:%SZ", __import__("time").gmtime())
        item["_fetcherVersion"] = "1.0.0"
    return BASE_RE


def save(output_path: Path) -> int:
    data = fetch()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    logger.info(f"Saved {len(data)} rare earth records to {output_path}")
    return len(data)


if __name__ == "__main__":
    output = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("public/data/rare-earth.json")
    count = save(output)
    print(f"\n✅ Rare earth: {count} records written to {output}")
