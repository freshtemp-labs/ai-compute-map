#!/usr/bin/env python3
"""
AI Compute Map — HTTP Client with caching, retry, and rate limiting.
Production-grade web scraping utility.
"""

import requests
import hashlib
import json
import os
import time
import logging
from pathlib import Path
from typing import Optional, Dict, Any
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

# Project root
PROJECT_ROOT = Path(__file__).resolve().parents[2]
CACHE_DIR = PROJECT_ROOT / ".cache"
CACHE_DIR.mkdir(exist_ok=True)

# Default headers to be polite
DEFAULT_HEADERS = {
    "User-Agent": "AI-Compute-Map-Bot/1.0 (https://github.com/ai-compute-map; data@aicomputemap.org)",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive",
}

# Source-specific headers
SOURCE_HEADERS = {
    "usgs": {"User-Agent": "AI-Compute-Map-Research-Bot/1.0"},
    "asml": {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},
    "iea": {"User-Agent": "AI-Compute-Map-Research-Bot/1.0 (academic research)"},
}


class CachedHTTPClient:
    """HTTP client with disk-based caching and automatic retry."""

    def __init__(self, cache_ttl: int = 3600, max_retries: int = 3, timeout: int = 30):
        """
        Args:
            cache_ttl: Cache time-to-live in seconds (default 1 hour)
            max_retries: Maximum retry attempts
            timeout: Request timeout in seconds
        """
        self.cache_ttl = cache_ttl
        self.max_retries = max_retries
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update(DEFAULT_HEADERS)

    def _cache_key(self, url: str, params: Optional[Dict] = None) -> str:
        """Generate cache filename from URL and params."""
        key = url + (json.dumps(params, sort_keys=True) if params else "")
        return hashlib.sha256(key.encode()).hexdigest()[:16] + ".json"

    def _cache_path(self, url: str, params: Optional[Dict] = None) -> Path:
        return CACHE_DIR / self._cache_key(url, params)

    def _read_cache(self, cache_path: Path) -> Optional[Dict]:
        """Read from cache if not expired."""
        if not cache_path.exists():
            return None
        age = time.time() - cache_path.stat().st_mtime
        if age > self.cache_ttl:
            logger.info(f"Cache expired for {cache_path.name} (age={age:.0f}s)")
            return None
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            logger.debug(f"Cache HIT: {cache_path.name}")
            return data
        except (json.JSONDecodeError, IOError):
            return None

    def _write_cache(self, cache_path: Path, data: Dict) -> None:
        """Write response to cache."""
        try:
            with open(cache_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except IOError as e:
            logger.warning(f"Failed to write cache: {e}")

    def fetch(self, url: str, params: Optional[Dict] = None,
              headers: Optional[Dict] = None,
              source: Optional[str] = None,
              use_cache: bool = True,
              parser: str = "auto") -> Dict[str, Any]:
        """
        Fetch URL with caching and retry logic.

        Returns:
            Dict with keys: url, status_code, content, timestamp, parsed
        """
        cache_path = self._cache_path(url, params)

        # Try cache first
        if use_cache:
            cached = self._read_cache(cache_path)
            if cached is not None:
                return cached

        # Prepare headers
        req_headers = dict(self.session.headers)
        if source and source in SOURCE_HEADERS:
            req_headers.update(SOURCE_HEADERS[source])
        if headers:
            req_headers.update(headers)

        # Retry loop
        last_error = None
        for attempt in range(1, self.max_retries + 1):
            try:
                logger.info(f"Fetching [{attempt}/{self.max_retries}]: {url}")
                resp = self.session.get(
                    url, params=params, headers=req_headers,
                    timeout=self.timeout, allow_redirects=True
                )
                resp.raise_for_status()

                result = {
                    "url": resp.url,
                    "status_code": resp.status_code,
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                    "content_type": resp.headers.get("Content-Type", ""),
                    "content_length": len(resp.content),
                }

                # Parse content
                content_type = result["content_type"]
                if "json" in content_type or parser == "json":
                    try:
                        result["parsed"] = resp.json()
                    except ValueError:
                        result["parsed"] = resp.text
                elif "html" in content_type or parser == "html":
                    from bs4 import BeautifulSoup
                    result["parsed"] = str(BeautifulSoup(resp.text, "html.parser"))
                    result["_soup"] = True  # Mark as soup-able
                else:
                    result["parsed"] = resp.text

                result["_raw"] = resp.text

                # Write cache
                if use_cache:
                    self._write_cache(cache_path, result)

                return result

            except requests.exceptions.RequestException as e:
                last_error = e
                logger.warning(f"Attempt {attempt} failed for {url}: {e}")
                if attempt < self.max_retries:
                    wait = 2 ** attempt  # Exponential backoff
                    logger.info(f"Retrying in {wait}s...")
                    time.sleep(wait)

        # All retries exhausted
        logger.error(f"All {self.max_retries} attempts failed for {url}: {last_error}")
        return {
            "url": url,
            "status_code": 0,
            "error": str(last_error),
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "parsed": None,
        }

    def fetch_json(self, url: str, **kwargs) -> Any:
        """Convenience method to fetch and parse JSON."""
        result = self.fetch(url, parser="json", **kwargs)
        return result.get("parsed")

    def fetch_html(self, url: str, **kwargs) -> "BeautifulSoup":
        """Fetch and return BeautifulSoup object."""
        from bs4 import BeautifulSoup
        result = self.fetch(url, parser="html", **kwargs)
        return BeautifulSoup(result.get("_raw", ""), "html.parser")


# Singleton instance
_client: Optional[CachedHTTPClient] = None

def get_client() -> CachedHTTPClient:
    """Get or create singleton HTTP client."""
    global _client
    if _client is None:
        _client = CachedHTTPClient()
    return _client
