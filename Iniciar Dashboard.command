#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Iniciando Streamlit Dashboard..."

if [ -x "venv/bin/python" ]; then
	PYTHON_BIN="venv/bin/python"
else
	PYTHON_BIN="/Library/Developer/CommandLineTools/Library/Frameworks/Python3.framework/Versions/3.9/bin/python3"
fi

"$PYTHON_BIN" -m streamlit run streamlit-dashboard/app/main.py --server.port=8501
