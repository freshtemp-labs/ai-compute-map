#!/usr/bin/env python3
"""
Foundry Fetcher — Semiconductor fabrication facility data.
Sources: Company annual reports, SEC filings, industry databases.
"""

import json
import logging
from pathlib import Path
from typing import List, Dict, Any

import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from scripts.utils.http_client import get_client
from scripts.utils.logger import setup_logging

logger = setup_logging("fetcher.foundry")

BASE_FOUNDRY: List[Dict[str, Any]] = [
    {"id": "fab1", "name": "TSMC Fab 18 (Tainan)", "company": "TSMC", "lat": 23.0829, "lng": 120.2717,
     "country": "Taiwan", "city": "Tainan", "processNode": "3nm/2nm", "type": "Foundry",
     "capacity": ">100K wpm", "status": "operational", "sourceTier": 1, "lastUpdated": "2024-03-15",
     "sourceRef": "tsmc.com/tsmcev/technology"},
    {"id": "fab2", "name": "TSMC Fab 15 (Taichung)", "company": "TSMC", "lat": 24.1840, "lng": 120.6014,
     "country": "Taiwan", "city": "Taichung", "processNode": "28nm/7nm", "type": "Foundry",
     "capacity": "~80K wpm", "status": "operational", "sourceTier": 1, "lastUpdated": "2024-03-15",
     "sourceRef": "tsmc.com"},
    {"id": "fab3", "name": "TSMC Arizona Fab 21", "company": "TSMC", "lat": 33.4484, "lng": -112.0740,
     "country": "USA", "city": "Phoenix", "processNode": "4nm/3nm", "type": "Foundry",
     "capacity": "60K wpm (planned)", "status": "construction", "sourceTier": 1, "lastUpdated": "2024-03-15",
     "sourceRef": "tsmc.com/arizona"},
    {"id": "fab4", "name": "TSMC Kumamoto (JASM)", "company": "TSMC", "lat": 32.8031, "lng": 130.7079,
     "country": "Japan", "city": "Kumamoto", "processNode": "12nm/16nm/28nm", "type": "Foundry",
     "capacity": "55K wpm", "status": "operational", "sourceTier": 1, "lastUpdated": "2024-12-01",
     "sourceRef": "jasm.com"},
    {"id": "fab5", "name": "TSMC Fab 12 (Hsinchu)", "company": "TSMC", "lat": 24.7742, "lng": 121.0144,
     "country": "Taiwan", "city": "Hsinchu", "processNode": "12nm/16nm", "type": "Foundry",
     "capacity": "~90K wpm", "status": "operational", "sourceTier": 1, "lastUpdated": "2024-03-15",
     "sourceRef": "tsmc.com"},
    {"id": "fab6", "name": "Samsung Pyeongtaek P3", "company": "Samsung", "lat": 36.9946, "lng": 127.1202,
     "country": "South Korea", "city": "Pyeongtaek", "processNode": "3nm GAA", "type": "Foundry",
     "capacity": "~70K wpm", "status": "operational", "sourceTier": 1, "lastUpdated": "2024-03-10",
     "sourceRef": "samsung.com/semiconductor/foundry"},
    {"id": "fab7", "name": "Samsung Taylor", "company": "Samsung", "lat": 30.5704, "lng": -97.4095,
     "country": "USA", "city": "Taylor", "processNode": "4nm/5nm", "type": "Foundry",
     "capacity": "TBD", "status": "construction", "sourceTier": 1, "lastUpdated": "2024-03-10",
     "sourceRef": "sds.samsung.com"},
    {"id": "fab8", "name": "Samsung Austin", "company": "Samsung", "lat": 30.2231, "lng": -97.7037,
     "country": "USA", "city": "Austin", "processNode": "14nm", "type": "Foundry",
     "capacity": "~40K wpm", "status": "operational", "sourceTier": 1, "lastUpdated": "2024-03-10",
     "sourceRef": "samsung.com"},
    {"id": "fab9", "name": "Intel Ocotillo (Fab 52/62)", "company": "Intel", "lat": 33.2809, "lng": -111.7904,
     "country": "USA", "city": "Chandler", "processNode": "20A/18A", "type": "IDM",
     "capacity": "TBD", "status": "construction", "sourceTier": 1, "lastUpdated": "2024-03-01",
     "sourceRef": "intel.com/content/www/us/en/foundry"},
    {"id": "fab10", "name": "Intel Ohio (New Albany)", "company": "Intel", "lat": 40.0658, "lng": -82.8088,
     "country": "USA", "city": "New Albany", "processNode": "18A/14A", "type": "IDM",
     "capacity": "TBD", "status": "construction", "sourceTier": 1, "lastUpdated": "2024-03-01",
     "sourceRef": "intel.com/ohio"},
    {"id": "fab11", "name": "Intel Leixlip (Fab 34)", "company": "Intel", "lat": 53.3666, "lng": -6.5023,
     "country": "Ireland", "city": "Leixlip", "processNode": "Intel 4", "type": "IDM",
     "capacity": "~50K wpm", "status": "operational", "sourceTier": 1, "lastUpdated": "2024-03-01",
     "sourceRef": "intel.com"},
    {"id": "fab12", "name": "Intel Kiryat Gat", "company": "Intel", "lat": 31.6100, "lng": 34.7745,
     "country": "Israel", "city": "Kiryat Gat", "processNode": "Intel 7", "type": "IDM",
     "capacity": "~60K wpm", "status": "operational", "sourceTier": 1, "lastUpdated": "2024-03-01",
     "sourceRef": "intel.com"},
    {"id": "fab13", "name": "SMIC Shanghai", "company": "SMIC", "lat": 31.2304, "lng": 121.4737,
     "country": "China", "city": "Shanghai", "processNode": "7nm/14nm", "type": "Foundry",
     "capacity": "~50K wpm", "status": "operational", "sourceTier": 1, "lastUpdated": "2024-03-08",
     "sourceRef": "smic.com/eng/sites"},
    {"id": "fab14", "name": "SMIC Beijing", "company": "SMIC", "lat": 40.0265, "lng": 116.3076,
     "country": "China", "city": "Beijing", "processNode": "12nm/28nm", "type": "Foundry",
     "capacity": "~40K wpm", "status": "operational", "sourceTier": 1, "lastUpdated": "2024-03-08",
     "sourceRef": "smic.com"},
    {"id": "fab15", "name": "SMIC Shenzhen", "company": "SMIC", "lat": 22.5431, "lng": 114.0579,
     "country": "China", "city": "Shenzhen", "processNode": "28nm+", "type": "Foundry",
     "capacity": "~30K wpm", "status": "operational", "sourceTier": 1, "lastUpdated": "2024-03-08",
     "sourceRef": "smic.com"},
    {"id": "fab16", "name": "GlobalFoundries Malta", "company": "GlobalFoundries", "lat": 42.9981, "lng": -73.7901,
     "country": "USA", "city": "Malta", "processNode": "12nm/14nm", "type": "Foundry",
     "capacity": "~60K wpm", "status": "operational", "sourceTier": 1, "lastUpdated": "2024-02-20",
     "sourceRef": "gf.com/manufacturing"},
    {"id": "fab17", "name": "GlobalFoundries Dresden", "company": "GlobalFoundries", "lat": 51.0504, "lng": 13.7373,
     "country": "Germany", "city": "Dresden", "processNode": "22FDX/28nm", "type": "Foundry",
     "capacity": "~80K wpm", "status": "operational", "sourceTier": 1, "lastUpdated": "2024-02-20",
     "sourceRef": "gf.com"},
    {"id": "fab18", "name": "UMC Fab 12A", "company": "UMC", "lat": 24.7742, "lng": 121.0144,
     "country": "Taiwan", "city": "Tainan", "processNode": "14nm/28nm", "type": "Foundry",
     "capacity": "~85K wpm", "status": "operational", "sourceTier": 1, "lastUpdated": "2024-02-15",
     "sourceRef": "umc.com/en/HTML/technology/production"},
]


def fetch() -> List[Dict[str, Any]]:
    """Return foundry records."""
    logger.info(f"Loading {len(BASE_FOUNDRY)} foundry records")
    for f in BASE_FOUNDRY:
        f["_fetchTimestamp"] = __import__("time").strftime("%Y-%m-%dT%H:%M:%SZ", __import__("time").gmtime())
        f["_fetcherVersion"] = "1.0.0"
    return BASE_FOUNDRY


def save(output_path: Path) -> int:
    data = fetch()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    logger.info(f"Saved {len(data)} foundries to {output_path}")
    return len(data)


if __name__ == "__main__":
    output = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("public/data/foundries.json")
    count = save(output)
    print(f"\n✅ Foundries: {count} records written to {output}")
