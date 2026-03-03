#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Iniciando Streamlit Dashboard..."
/Library/Developer/CommandLineTools/Library/Frameworks/Python3.framework/Versions/3.9/bin/python3 -m streamlit run streamlit-dashboard/app/main.py --server.port=8501
