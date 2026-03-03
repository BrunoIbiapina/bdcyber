"""
Interactive data table with column selection, pagination, and export.
"""
from __future__ import annotations

import pandas as pd
import streamlit as st

from app.utils.io import to_csv_bytes, to_excel_bytes


def render_table_tab(df: pd.DataFrame) -> None:
    """Render the full interactive table view with export controls."""
    st.subheader("Dados Filtrados")

    # ── Column selector ───────────────────────────────────────────────────────
    all_cols = df.columns.tolist()
    selected_cols = st.multiselect(
        "Colunas visíveis",
        options=all_cols,
        default=all_cols,
        key="table_visible_cols",
        help="Selecione as colunas a exibir",
    )
    if not selected_cols:
        st.warning("Selecione ao menos uma coluna para exibir a tabela.")
        return

    view_df = df[selected_cols]

    # ── Pagination ────────────────────────────────────────────────────────────
    col_pg, col_sz = st.columns([1, 3])
    with col_sz:
        page_size = st.select_slider(
            "Linhas por página",
            options=[10, 25, 50, 100, 200, 500],
            value=50,
            key="table_page_size",
        )
    total_pages = max(1, (len(view_df) - 1) // page_size + 1)
    with col_pg:
        page = st.number_input(
            "Página",
            min_value=1,
            max_value=total_pages,
            value=1,
            step=1,
            key="table_page",
        )

    start = (page - 1) * page_size
    end = start + page_size
    page_df = view_df.iloc[start:end]

    st.dataframe(page_df, use_container_width=True, height=420)
    st.caption(
        f"Exibindo **{start + 1:,}** – **{min(end, len(view_df)):,}** "
        f"de **{len(view_df):,}** registros  |  Página {page}/{total_pages}"
    )

    # ── Export ────────────────────────────────────────────────────────────────
    st.divider()
    st.markdown("**Exportar dados filtrados**")
    c1, c2 = st.columns(2)

    with c1:
        st.download_button(
            label="⬇️ Baixar CSV",
            data=to_csv_bytes(view_df),
            file_name="dados_filtrados.csv",
            mime="text/csv",
            use_container_width=True,
        )
    with c2:
        st.download_button(
            label="⬇️ Baixar Excel (.xlsx)",
            data=to_excel_bytes(view_df),
            file_name="dados_filtrados.xlsx",
            mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            use_container_width=True,
        )
