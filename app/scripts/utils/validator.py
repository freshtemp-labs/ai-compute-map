#!/usr/bin/env python3
"""
Data Validation Engine — Ensures every data point meets quality standards.
For a platform serving researchers and financial professionals, data integrity is non-negotiable.
"""

import logging
from typing import List, Dict, Any, Tuple
from pathlib import Path
import json
import re

logger = logging.getLogger(__name__)

# Country name → ISO mapping for cross-reference
COUNTRY_MAP = {
    "China": "CN", "USA": "US", "United States": "US",
    "Japan": "JP", "South Korea": "KR", "Korea": "KR",
    "Taiwan": "TW", "Netherlands": "NL", "Germany": "DE",
    "Ireland": "IE", "Israel": "IL", "Singapore": "SG",
    "Malaysia": "MY", "India": "IN", "Australia": "AU",
    "Canada": "CA", "UK": "GB", "United Kingdom": "GB",
    "France": "FR", "Belgium": "BE", "Finland": "FI",
    "Brazil": "BR", "Chile": "CL", "Saudi Arabia": "SA",
    "Qatar": "QA", "Bahrain": "BH", "Uganda": "UG",
    "Hong Kong": "HK", "Ningxia": "CN", "Guizhou": "CN",
    "Inner Mongolia": "CN", "Gansu": "CN",
}

class ValidationError:
    """Single validation error record."""
    def __init__(self, entity: str, field: str, message: str, severity: str = "ERROR"):
        self.entity = entity
        self.field = field
        self.message = message
        self.severity = severity  # ERROR, WARNING, INFO

    def to_dict(self) -> Dict:
        return {
            "entity": self.entity,
            "field": self.field,
            "message": self.message,
            "severity": self.severity,
        }

class DataValidator:
    """Production-grade data validation engine."""

    def __init__(self):
        self.errors: List[ValidationError] = []
        self.warnings: List[ValidationError] = []

    # ─── Coordinate Validation ───────────────────────────────────

    def validate_coordinates(self, lat: float, lng: float, entity_id: str) -> bool:
        """Validate geographic coordinates are within valid ranges."""
        valid = True
        if not isinstance(lat, (int, float)) or not -90 <= lat <= 90:
            self.errors.append(ValidationError(
                entity_id, "lat",
                f"Invalid latitude: {lat} (must be -90 to 90)",
            ))
            valid = False
        if not isinstance(lng, (int, float)) or not -180 <= lng <= 180:
            self.errors.append(ValidationError(
                entity_id, "lng",
                f"Invalid longitude: {lng} (must be -180 to 180)",
            ))
            valid = False
        # Check coordinates are not null island (0,0) unless explicitly allowed
        if lat == 0.0 and lng == 0.0:
            self.errors.append(ValidationError(
                entity_id, "coordinates",
                "Coordinates are (0,0) — null island. Likely missing data.",
            ))
            valid = False
        return valid

    # ─── Numeric Validation ──────────────────────────────────────

    def validate_positive_number(self, value: Any, field: str, entity_id: str,
                                  min_val: float = 0, max_val: float = float("inf")) -> bool:
        """Validate a positive numeric value within range."""
        if not isinstance(value, (int, float)):
            self.errors.append(ValidationError(
                entity_id, field,
                f"Must be numeric, got {type(value).__name__}: {value}",
            ))
            return False
        if value < min_val or value > max_val:
            self.errors.append(ValidationError(
                entity_id, field,
                f"Value {value} out of range [{min_val}, {max_val}]",
            ))
            return False
        return True

    def validate_pue(self, pue: float, entity_id: str) -> bool:
        """Validate Power Usage Effectiveness (must be >= 1.0)."""
        if not isinstance(pue, (int, float)):
            self.errors.append(ValidationError(entity_id, "pue", "PUE must be numeric"))
            return False
        if pue < 1.0:
            self.errors.append(ValidationError(
                entity_id, "pue",
                f"PUE {pue} < 1.0 — physically impossible (minimum PUE = 1.0)",
            ))
            return False
        if pue > 3.0:
            self.warnings.append(ValidationError(
                entity_id, "pue",
                f"PUE {pue} > 3.0 — unusually high, verify data source",
                "WARNING",
            ))
        return True

    def validate_power_capacity(self, power: float, entity_id: str) -> bool:
        """Validate power capacity is in reasonable range."""
        if not self.validate_positive_number(power, "powerCapacity", entity_id, 0, 10000):
            return False
        if power > 5000:
            self.warnings.append(ValidationError(
                entity_id, "powerCapacity",
                f"Power capacity {power} MW > 5000 — verify with multiple sources",
                "WARNING",
            ))
        return True

    # ─── String Validation ───────────────────────────────────────

    def validate_non_empty_string(self, value: Any, field: str, entity_id: str,
                                   max_length: int = 200) -> bool:
        """Validate a non-empty string field."""
        if not isinstance(value, str) or not value.strip():
            self.errors.append(ValidationError(
                entity_id, field,
                f"Must be non-empty string, got: {value!r}",
            ))
            return False
        if len(value) > max_length:
            self.warnings.append(ValidationError(
                entity_id, field,
                f"String length {len(value)} > {max_length}",
                "WARNING",
            ))
        return True

    def validate_country(self, country: str, entity_id: str) -> bool:
        """Validate country name is recognized."""
        if not self.validate_non_empty_string(country, "country", entity_id):
            return False
        if country not in COUNTRY_MAP:
            self.warnings.append(ValidationError(
                entity_id, "country",
                f"Unrecognized country: '{country}' — verify spelling",
                "WARNING",
            ))
        return True

    # ─── Cross-Reference Validation ──────────────────────────────

    def validate_no_duplicate_ids(self, items: List[Dict], id_field: str = "id") -> bool:
        """Check for duplicate IDs across all items."""
        seen = set()
        valid = True
        for item in items:
            item_id = item.get(id_field)
            if item_id in seen:
                self.errors.append(ValidationError(
                    item_id, id_field,
                    f"Duplicate ID detected: {item_id}",
                ))
                valid = False
            seen.add(item_id)
        return valid

    def validate_no_duplicate_coordinates(self, items: List[Dict],
                                           tolerance: float = 0.001) -> bool:
        """Check for facilities with suspiciously identical coordinates."""
        coord_map: Dict[Tuple[float, float], List[str]] = {}
        for item in items:
            lat = item.get("lat")
            lng = item.get("lng")
            if lat is None or lng is None:
                continue
            key = (round(lat, 3), round(lng, 3))
            coord_map.setdefault(key, []).append(item.get("id", "unknown"))

        valid = True
        for coord, ids in coord_map.items():
            if len(ids) > 1:
                self.warnings.append(ValidationError(
                    ",".join(ids), "coordinates",
                    f"Facilities share identical coordinates {coord}: {ids} — "
                    f"may be city-level (not exact location)",
                    "WARNING",
                ))
        return valid

    # ─── Entity-Specific Validation ──────────────────────────────

    def validate_data_center(self, dc: Dict) -> bool:
        """Validate a single data center entry."""
        eid = dc.get("id", "unknown")
        checks = [
            self.validate_non_empty_string(dc.get("id"), "id", eid),
            self.validate_non_empty_string(dc.get("name"), "name", eid),
            self.validate_non_empty_string(dc.get("provider"), "provider", eid),
            self.validate_non_empty_string(dc.get("city"), "city", eid),
            self.validate_country(dc.get("country"), eid),
            self.validate_coordinates(dc.get("lat"), dc.get("lng"), eid),
            self.validate_power_capacity(dc.get("powerCapacity", 0), eid),
            self.validate_pue(dc.get("pue", 1.5), eid),
        ]
        return all(checks)

    def validate_foundry(self, fab: Dict) -> bool:
        """Validate a single foundry/facility entry."""
        eid = fab.get("id", "unknown")
        checks = [
            self.validate_non_empty_string(fab.get("id"), "id", eid),
            self.validate_non_empty_string(fab.get("name"), "name", eid),
            self.validate_non_empty_string(fab.get("company"), "company", eid),
            self.validate_non_empty_string(fab.get("city"), "city", eid),
            self.validate_country(fab.get("country"), eid),
            self.validate_coordinates(fab.get("lat"), fab.get("lng"), eid),
        ]
        return all(checks)

    def validate_supply_chain(self, item: Dict) -> bool:
        """Validate a supply chain data point."""
        eid = item.get("id", "unknown")
        checks = [
            self.validate_non_empty_string(item.get("id"), "id", eid),
            self.validate_non_empty_string(item.get("name"), "name", eid),
            self.validate_non_empty_string(item.get("layer"), "layer", eid),
            self.validate_coordinates(item.get("lat"), item.get("lng"), eid),
        ]
        return all(checks)

    # ─── Batch Validation ────────────────────────────────────────

    def validate_dataset(self, items: List[Dict], entity_type: str) -> Dict[str, Any]:
        """Validate entire dataset and return report."""
        logger.info(f"Validating {len(items)} {entity_type} records...")

        self.errors = []
        self.warnings = []

        # Entity-specific validation
        validators = {
            "datacenter": self.validate_data_center,
            "foundry": self.validate_foundry,
            "supply": self.validate_supply_chain,
        }
        validator = validators.get(entity_type, self.validate_data_center)

        valid_count = 0
        for item in items:
            if validator(item):
                valid_count += 1

        # Cross-record validation
        self.validate_no_duplicate_ids(items)
        self.validate_no_duplicate_coordinates(items)

        report = {
            "entity_type": entity_type,
            "total": len(items),
            "valid": valid_count,
            "invalid": len(items) - valid_count,
            "errors": [e.to_dict() for e in self.errors],
            "warnings": [w.to_dict() for w in self.warnings],
            "error_rate": round(len(self.errors) / max(len(items), 1) * 100, 2),
            "warning_rate": round(len(self.warnings) / max(len(items), 1) * 100, 2),
            "pass": len(self.errors) == 0,
        }

        status = "PASS" if report["pass"] else "FAIL"
        logger.info(
            f"Validation {status}: {valid_count}/{len(items)} valid, "
            f"{len(self.errors)} errors, {len(self.warnings)} warnings"
        )

        return report

    def save_report(self, report: Dict, output_path: Path) -> None:
        """Save validation report to JSON."""
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        logger.info(f"Validation report saved to {output_path}")
