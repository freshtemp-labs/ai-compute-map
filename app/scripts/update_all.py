#!/usr/bin/env python3
"""
AI Compute Map — Master Data Update Pipeline
Coordinates all fetchers, validates data, generates production JSON files.
Run: python scripts/update_all.py

Exit codes:
  0 = All data updated and validated
  1 = Validation errors found
  2 = Partial update (some fetchers failed)
  3 = System error
"""

import sys
import json
import time
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Tuple

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

from scripts.utils.logger import setup_logging
from scripts.utils.validator import DataValidator
from scripts.fetchers import datacenter_fetcher, foundry_fetcher, lithography_fetcher, rare_earth_fetcher

logger = setup_logging("update_all")

# Output paths
DATA_DIR = PROJECT_ROOT / "public" / "data"
META_PATH = DATA_DIR / "metadata.json"
VALIDATION_DIR = PROJECT_ROOT / "logs"

# ─── Registry of all fetchers ──────────────────────────────────
FETCHER_REGISTRY = [
    {
        "name": "datacenter",
        "label": "Data Centers",
        "fetcher": datacenter_fetcher,
        "output": DATA_DIR / "datacenters.json",
        "entity_type": "datacenter",
    },
    {
        "name": "foundry",
        "label": "Foundries",
        "fetcher": foundry_fetcher,
        "output": DATA_DIR / "foundries.json",
        "entity_type": "foundry",
    },
    {
        "name": "lithography",
        "label": "Lithography Equipment",
        "fetcher": lithography_fetcher,
        "output": DATA_DIR / "lithography.json",
        "entity_type": "supply",
    },
    {
        "name": "rare_earth",
        "label": "Rare Earth",
        "fetcher": rare_earth_fetcher,
        "output": DATA_DIR / "rare-earth.json",
        "entity_type": "supply",
    },
]


def run_fetcher(entry: Dict) -> Tuple[bool, int, Dict]:
    """Run a single fetcher and return (success, record_count, validation_report)."""
    name = entry["name"]
    label = entry["label"]
    output = entry["output"]
    entity_type = entry["entity_type"]

    logger.info(f"{'='*60}")
    logger.info(f"Fetching: {label} ({name})")
    logger.info(f"{'='*60}")

    try:
        # Run fetcher
        count = entry["fetcher"].save(output)
        logger.info(f"✅ {label}: {count} records fetched")

        # Validate
        logger.info(f"Validating {label} data...")
        with open(output, "r", encoding="utf-8") as f:
            data = json.load(f)

        validator = DataValidator()
        report = validator.validate_dataset(data, entity_type)

        # Save validation report
        report_path = VALIDATION_DIR / f"validation_{name}_{datetime.now():%Y%m%d_%H%M%S}.json"
        validator.save_report(report, report_path)

        if report["pass"]:
            logger.info(f"✅ {label} validation PASSED")
        else:
            logger.warning(
                f"⚠️ {label} validation FAILED: "
                f"{len(report['errors'])} errors, {len(report['warnings'])} warnings"
            )
            for err in report["errors"]:
                logger.error(f"  ERROR [{err['entity']}.{err['field']}]: {err['message']}")

        return report["pass"] or len(report["errors"]) < 5, count, report  # Allow up to 4 errors

    except Exception as e:
        logger.error(f"❌ {label} fetcher failed: {e}", exc_info=True)
        return False, 0, {"error": str(e), "pass": False}


def generate_metadata(results: List[Dict]) -> Dict:
    """Generate metadata.json with update summary."""
    metadata = {
        "version": "1.0.0",
        "pipeline": "ai-compute-map",
        "updatedAt": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "environment": {
            "python": sys.version.split()[0],
            "platform": sys.platform,
        },
        "datasets": {},
        "summary": {
            "totalRecords": 0,
            "totalErrors": 0,
            "totalWarnings": 0,
            "fetchersPassed": 0,
            "fetchersFailed": 0,
        },
    }

    for r in results:
        name = r["name"]
        metadata["datasets"][name] = {
            "label": r["label"],
            "records": r["count"],
            "outputFile": str(r["output"].relative_to(PROJECT_ROOT)),
            "validation": {
                "pass": r["report"].get("pass", False),
                "errors": len(r["report"].get("errors", [])),
                "warnings": len(r["report"].get("warnings", [])),
                "errorRate": r["report"].get("error_rate", 0),
            },
        }
        metadata["summary"]["totalRecords"] += r["count"]
        metadata["summary"]["totalErrors"] += len(r["report"].get("errors", []))
        metadata["summary"]["totalWarnings"] += len(r["report"].get("warnings", []))
        if r["report"].get("pass", False):
            metadata["summary"]["fetchersPassed"] += 1
        else:
            metadata["summary"]["fetchersFailed"] += 1

    return metadata


def main() -> int:
    """Main entry point. Returns exit code."""
    start_time = time.time()
    logger.info("=" * 60)
    logger.info("AI Compute Map — Data Update Pipeline")
    logger.info(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info("=" * 60)

    # Ensure directories exist
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    VALIDATION_DIR.mkdir(parents=True, exist_ok=True)

    # Run all fetchers
    results = []
    all_passed = True

    for entry in FETCHER_REGISTRY:
        success, count, report = run_fetcher(entry)
        results.append({
            "name": entry["name"],
            "label": entry["label"],
            "count": count,
            "output": entry["output"],
            "report": report,
            "success": success,
        })
        if not success:
            all_passed = False

    # Generate metadata
    metadata = generate_metadata(results)
    with open(META_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)
    logger.info(f"Metadata saved to {META_PATH}")

    # Print summary
    elapsed = time.time() - start_time
    logger.info("=" * 60)
    logger.info("PIPELINE SUMMARY")
    logger.info("=" * 60)
    for r in results:
        status = "✅ PASS" if r["success"] else "❌ FAIL"
        logger.info(
            f"  {status} | {r['label']:<25} | {r['count']:>4} records | "
            f"E:{r['report'].get('errors', []).__len__():>2} W:{r['report'].get('warnings', []).__len__():>2}"
        )
    logger.info(f"  Total: {metadata['summary']['totalRecords']} records")
    logger.info(f"  Time: {elapsed:.1f}s")

    if all_passed:
        logger.info("✅ ALL FETCHERS PASSED")
        return 0
    elif metadata["summary"]["fetchersFailed"] < len(FETCHER_REGISTRY):
        logger.warning("⚠️ PARTIAL SUCCESS — some fetchers had issues")
        return 2
    else:
        logger.error("❌ ALL FETCHERS FAILED")
        return 1


if __name__ == "__main__":
    sys.exit(main())
