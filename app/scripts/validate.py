#!/usr/bin/env python3
"""
Standalone data validation script.
Run: python scripts/validate.py [dataset_name]
"""

import sys
import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

from scripts.utils.logger import setup_logging
from scripts.utils.validator import DataValidator

logger = setup_logging("validate")
DATA_DIR = PROJECT_ROOT / "public" / "data"

DATASETS = {
    "datacenter": ("datacenters.json", "datacenter"),
    "foundry": ("foundries.json", "foundry"),
    "lithography": ("lithography.json", "supply"),
    "rare_earth": ("rare-earth.json", "supply"),
}


def validate_dataset(name: str) -> bool:
    if name not in DATASETS:
        logger.error(f"Unknown dataset: {name}. Available: {', '.join(DATASETS.keys())}")
        return False

    filename, entity_type = DATASETS[name]
    filepath = DATA_DIR / filename

    if not filepath.exists():
        logger.error(f"File not found: {filepath}")
        return False

    logger.info(f"Validating {name} from {filepath}")
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    validator = DataValidator()
    report = validator.validate_dataset(data, entity_type)

    logger.info(f"Results: {report['valid']}/{report['total']} valid")
    logger.info(f"Errors: {len(report['errors'])}, Warnings: {len(report['warnings'])}")

    if report["errors"]:
        logger.error("Errors found:")
        for e in report["errors"][:10]:
            logger.error(f"  [{e['severity']}] {e['entity']}.{e['field']}: {e['message']}")

    return report["pass"]


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "all"

    if target == "all":
        all_passed = True
        for name in DATASETS:
            if not validate_dataset(name):
                all_passed = False
        sys.exit(0 if all_passed else 1)
    else:
        sys.exit(0 if validate_dataset(target) else 1)
