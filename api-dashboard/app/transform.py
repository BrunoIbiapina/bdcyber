import pandas as pd
from .config import ID_COL, DATE_COL, VALUE_COL, CATEGORY_COL, STATUS_COL, USER_COL, SOURCE_COL

def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    # Garante que as colunas existam
    expected = [ID_COL, DATE_COL, VALUE_COL, CATEGORY_COL, STATUS_COL, USER_COL, SOURCE_COL]
    for col in expected:
        if col not in df.columns:
            # cria se faltar (pra não quebrar)
            df[col] = None
    return df

def clean_df(df: pd.DataFrame) -> pd.DataFrame:
    df = normalize_columns(df)

    # Conversão robusta para datetime
    df[DATE_COL] = pd.to_datetime(df[DATE_COL], errors="coerce")
    # VALUE_COL pode não existir, então só converte se existir
    if VALUE_COL in df.columns:
        df[VALUE_COL] = pd.to_numeric(df[VALUE_COL], errors="coerce")

    # Só remove linhas com data inválida
    df = df.dropna(subset=[DATE_COL])

    for c in [CATEGORY_COL, STATUS_COL, USER_COL, SOURCE_COL]:
        if c in df.columns:
            df[c] = df[c].astype(str).str.strip()

    return df

def apply_filters(
    df: pd.DataFrame,
    start: str,
    end: str,
    categorias: list[str] | None = None,
    status: list[str] | None = None,
    search: str | None = None,
) -> pd.DataFrame:
    start_dt = pd.to_datetime(start)
    end_dt = pd.to_datetime(end)

    df = df[(df[DATE_COL] >= start_dt) & (df[DATE_COL] <= end_dt)]

    if categorias:
        df = df[df[CATEGORY_COL].isin(categorias)]

    if status:
        df = df[df[STATUS_COL].isin(status)]

    if search:
        q = search.lower()
        # busca simples em várias colunas
        df = df[
            df[ID_COL].astype(str).str.lower().str.contains(q, na=False) |
            df[CATEGORY_COL].astype(str).str.lower().str.contains(q, na=False) |
            df[STATUS_COL].astype(str).str.lower().str.contains(q, na=False) |
            df[USER_COL].astype(str).str.lower().str.contains(q, na=False) |
            df[SOURCE_COL].astype(str).str.lower().str.contains(q, na=False)
        ]

    return df