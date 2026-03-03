"""
Sidebar filter panel.

Renders filtros globais de texto, multiselects categóricos, sliders numéricos
e date-pickers. Retorna o DataFrame filtrado.
"""
from __future__ import annotations

import pandas as pd
import streamlit as st

from app.utils.schema import Schema


def render_sidebar_filters(df: pd.DataFrame, schema: Schema) -> pd.DataFrame:
    """Render sidebar filters and return the filtered DataFrame."""
    filtered = df.copy()

    st.sidebar.markdown("## Filtros")

    # ── Global text search ────────────────────────────────────────────────────
    search = st.sidebar.text_input(
        "🔍 Busca global (texto)",
        key="filter_global_search",
        help="Pesquisa em todas as colunas de texto",
    )
    if search.strip():
        text_cols = df.select_dtypes(include="object").columns.tolist()
        if text_cols:
            mask = pd.Series(False, index=filtered.index)
            for col in text_cols:
                mask |= filtered[col].astype(str).str.contains(
                    search, case=False, na=False, regex=False
                )
            filtered = filtered[mask]

    # ── Categorical multiselects ──────────────────────────────────────────────
    if schema.categorical:
        st.sidebar.markdown("### Categorias")
        for col in schema.categorical[:6]:
            unique_vals = sorted(df[col].dropna().unique().tolist(), key=str)
            if len(unique_vals) < 2:
                continue
            selected = st.sidebar.multiselect(
                f"{col}",
                options=unique_vals,
                default=[],
                key=f"filter_cat_{col}",
            )
            if selected:
                filtered = filtered[filtered[col].isin(selected)]

    # ── Numeric range sliders ─────────────────────────────────────────────────
    if schema.numeric:
        st.sidebar.markdown("### Numéricas")
        for col in schema.numeric[:4]:
            col_data = df[col].dropna()
            if col_data.empty:
                continue
            min_v = float(col_data.min())
            max_v = float(col_data.max())
            if min_v >= max_v:
                continue
            rng = st.sidebar.slider(
                f"{col}",
                min_value=min_v,
                max_value=max_v,
                value=(min_v, max_v),
                key=f"filter_num_{col}",
            )
            filtered = filtered[
                (filtered[col] >= rng[0]) & (filtered[col] <= rng[1])
            ]

    # ── Date range picker ─────────────────────────────────────────────────────
    if schema.datetime:
        st.sidebar.markdown("### Período")
        date_col = schema.datetime[0]
        dt_series = df[date_col].dropna()
        if not dt_series.empty:
            min_date = dt_series.min().date()
            max_date = dt_series.max().date()
            col_a, col_b = st.sidebar.columns(2)
            with col_a:
                start_date = st.date_input(
                    "De",
                    value=min_date,
                    min_value=min_date,
                    max_value=max_date,
                    key="filter_date_start",
                )
            with col_b:
                end_date = st.date_input(
                    "Até",
                    value=max_date,
                    min_value=min_date,
                    max_value=max_date,
                    key="filter_date_end",
                )
            if start_date <= end_date:
                filtered = filtered[
                    (filtered[date_col].dt.date >= start_date)
                    & (filtered[date_col].dt.date <= end_date)
                ]
            else:
                st.sidebar.error("Data inicial deve ser ≤ data final.")

    # ── Filter summary ────────────────────────────────────────────────────────
    removed = len(df) - len(filtered)
    if removed > 0:
        pct = removed / len(df) * 100
        st.sidebar.info(f"**{removed:,}** registros filtrados ({pct:.1f}%)")
    else:
        st.sidebar.success("Sem filtros ativos")

    return filtered
