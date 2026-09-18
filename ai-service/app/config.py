import os
from pathlib import Path

AI_KEY = os.environ.get("AI_SERVICE_KEY", "")

# root ai-service/ (dua level di atas file ini: app/config.py -> app -> ai-service)
BASE_DIR = Path(__file__).resolve().parent.parent
FIXTURE_DIR = BASE_DIR / "tests" / "fixtures"
