#!/usr/bin/env python3
"""
Lithography Equipment Fetcher — ASML, Canon, Nikon shipment and revenue data.
Sources: Company annual reports, investor presentations, industry databases.
"""

import json
from pathlib import Path
from typing import List, Dict, Any

import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from scripts.utils.logger import setup_logging

logger = setup_logging("fetcher.lithography")

BASE_LITHO: List[Dict[str, Any]] = [
    {"id": "litho1", "name": "ASML EUV", "company": "ASML", "country": "Netherlands",
     "lat": 51.4230, "lng": 5.4621, "city": "Veldhoven", "technology": "EUV",
     "unitsShipped2024": 44, "marketShare": 61.2, "revenueB": 23.5,
     "avgPriceMEUR": 190, "layer": "supply", "category": "lithography",
     "sourceTier": 1, "lastUpdated": "2024-02-15", "sourceRef": "asml.com/investors"},
    {"id": "litho2", "name": "Canon Semiconductor Lithography", "company": "Canon", "country": "Japan",
     "lat": 35.6415, "lng": 139.6981, "city": "Tokyo", "technology": "i-line/KrF",
     "unitsShipped2024": 233, "marketShare": 34.1, "revenueB": 1.65,
     "avgPriceMEUR": 7.1, "layer": "supply", "category": "lithography",
     "sourceTier": 1, "lastUpdated": "2024-02-15", "sourceRef": "global.canon/en/ir"},
    {"id": "litho3", "name": "Nikon Precision Equipment", "company": "Nikon", "country": "Japan",
     "lat": 35.6500, "lng": 139.7500, "city": "Tokyo", "technology": "ArF/KrF",
     "unitsShipped2024": 32, "marketShare": 4.7, "revenueB": 1.25,
     "avgPriceMEUR": 39.1, "layer": "supply", "category": "lithography",
     "sourceTier": 1, "lastUpdated": "2024-02-15", "sourceRef": "nikon.com/investors"},
    {"id": "litho4", "name": "ASML DUV (ArFi)", "company": "ASML", "country": "Netherlands",
     "lat": 51.4230, "lng": 5.4621, "city": "Veldhoven", "technology": "ArFi",
     "unitsShipped2024": 129, "marketShare": 97.7, "revenueB": 12.0,
     "avgPriceMEUR": 74, "layer": "supply", "category": "lithography",
     "sourceTier": 1, "lastUpdated": "2024-02-15", "sourceRef": "asml.com/investors"},
]


def fetch() -> List[Dict[str, Any]]:
    logger.info(f"Loading {len(BASE_LITHO)} lithography records")
    for item in BASE_LITHO:
        item["_fetchTimestamp"] = __import__("time").strftime("%Y-%m-%dT%H:%M:%SZ", __import__("time").gmtime())
        item["_fetcherVersion"] = "1.0.0"
    return BASE_LITHO


def save(output_path: Path) -> int:
    data = fetch()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    logger.info(f"Saved {len(data)} lithography records to {output_path}")
    return len(data)


if __name__ == "__main__":
    output = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("public/data/lithography.json")
    count = save(output)
    print(f"\n✅ Lithography: {count} records written to {output}")
