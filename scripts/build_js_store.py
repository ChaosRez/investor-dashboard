# Generate public/js/data-store.js (the offline mirror of public/data/*.json).
# Delegates to the same function Live Sync uses, so the two can never produce different stores.
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src"))

from apex_etf.sync import build_js_store  # noqa: E402

build_js_store()
print("Generated public/js/data-store.js successfully.")
