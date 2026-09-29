#!/usr/bin/env python3
"""
ApexETF Server Compatibility Shim
Enables running the dashboard directly via `python3 server.py`
while dispatching to the modular `apex_etf` package.
"""

import os
import sys

# Ensure src/ is available in sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(BASE_DIR, "src")
if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)

from apex_etf.server import main

if __name__ == "__main__":
    main()
