"""
Launcher wrapper — sets CWD before starting Streamlit.
Usage: python3 run.py
"""
import os
import sys
from pathlib import Path

# Ensure CWD is the project root so Streamlit finds .streamlit/config.toml
PROJECT_ROOT = Path(__file__).parent
os.chdir(PROJECT_ROOT)

# Patch argv to simulate `streamlit run app/main.py`
sys.argv = ["streamlit", "run", "app/main.py", "--server.headless=true"]

from streamlit.web.cli import main  # noqa: E402

main(prog_name="streamlit")
