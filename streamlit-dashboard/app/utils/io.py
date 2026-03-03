"""CSV I/O utilities: reading with encoding fallback and separator detection."""
from __future__ import annotations

import io
import logging
from pathlib import Path

import pandas as pd
import streamlit as st

logger = logging.getLogger(__name__)

DEFAULT_CSV_PATH = Path(__file__).parent.parent.parent / "data" / "dados.csv"


@st.cache_data(show_spinner=False)
def load_csv(data: bytes) -> tuple[pd.DataFrame, str]:
    """
    Load a CSV from raw bytes.

    Tries UTF-8 → latin-1 → cp1252 encodings and comma → semicolon → tab → pipe
    separators. Returns the first combination that produces more than 1 column.
    """
    encodings = ["utf-8", "latin-1", "cp1252"]
    separators = [",", ";", "\t", "|"]

    for enc in encodings:
        for sep in separators:
            try:
                df = pd.read_csv(
                    io.BytesIO(data),
                    encoding=enc,
                    sep=sep,
                    engine="python",
                    on_bad_lines="warn",
                )
                if df.shape[1] > 1:
                    msg = f"Encoding: `{enc}` · Separador: `{sep}`"
                    logger.info("CSV lido com sucesso — %s", msg)
                    return df, msg
            except Exception:
                continue

    return pd.DataFrame(), "Não foi possível ler o CSV. Verifique o formato."


def read_path(path: Path) -> tuple[pd.DataFrame, str]:
    """Convenience wrapper: read a file from disk → bytes → load_csv."""
    try:
        raw = path.read_bytes()
        return load_csv(raw)
    except OSError as exc:
        return pd.DataFrame(), f"Erro ao ler arquivo: {exc}"


def to_csv_bytes(df: pd.DataFrame) -> bytes:
    """Export DataFrame as UTF-8-BOM CSV (Excel-compatible)."""
    return df.to_csv(index=False).encode("utf-8-sig")


def to_excel_bytes(df: pd.DataFrame) -> bytes:
    """Export DataFrame as .xlsx bytes."""
    buf = io.BytesIO()
    with pd.ExcelWriter(buf, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Dados")
    return buf.getvalue()
