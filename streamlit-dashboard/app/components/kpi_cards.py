"""
KPI metric cards — rendered as styled HTML gradient cards.
"""
from __future__ import annotations

from typing import Optional

import pandas as pd
import streamlit as st

from app.utils.metrics import compute_kpis, fmt_number
from app.utils.schema import Schema


def render_kpi_cards(
    df: pd.DataFrame,
    schema: Schema,
    value_col: Optional[str] = None,
) -> None:
    """Render 4 gradient KPI cards in a single row."""
    kpis = compute_kpis(df, schema, value_col)

    c1, c2, c3, c4 = st.columns(4)

    # Card 1 — Total rows
    c1.markdown(
        _card(
            icon="📋",
            label="Total de Registros",
            value=f"{kpis['total_rows']:,}",
            subtitle="após filtros aplicados",
            gradient="linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)",
            shadow="rgba(99,102,241,.38)",
        ),
        unsafe_allow_html=True,
    )

    # Card 2 — Columns
    c2.markdown(
        _card(
            icon="📐",
            label="Colunas",
            value=str(kpis["total_cols"]),
            subtitle="no dataset",
            gradient="linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%)",
            shadow="rgba(14,165,233,.35)",
        ),
        unsafe_allow_html=True,
    )

    # Card 3 — Top category
    tc = kpis.get("top_category")
    if tc:
        c3.markdown(
            _card(
                icon="🏆",
                label=f"Top · {tc['col']}",
                value=tc["value"],
                subtitle=f"{tc['count']:,} registros ({tc['pct']}%)",
                gradient="linear-gradient(135deg,#f59e0b 0%,#ef4444 100%)",
                shadow="rgba(245,158,11,.38)",
            ),
            unsafe_allow_html=True,
        )
    else:
        c3.markdown(
            _card("🏆", "Top Categoria", "N/A", "—",
                  "linear-gradient(135deg,#64748b,#475569)", "rgba(100,116,139,.25)"),
            unsafe_allow_html=True,
        )

    # Card 4 — Value column
    vc = kpis.get("value_col")
    if vc:
        c4.markdown(
            _card(
                icon="💰",
                label=f"Soma · {vc['name']}",
                value=fmt_number(vc["sum"]),
                subtitle=f"Média: {fmt_number(vc['mean'])}  ·  Mediana: {fmt_number(vc['median'])}",
                gradient="linear-gradient(135deg,#10b981 0%,#0ea5e9 100%)",
                shadow="rgba(16,185,129,.38)",
            ),
            unsafe_allow_html=True,
        )
    else:
        c4.markdown(
            _card("💰", "Valor", "N/A", "—",
                  "linear-gradient(135deg,#64748b,#475569)", "rgba(100,116,139,.25)"),
            unsafe_allow_html=True,
        )


def _card(
    icon: str,
    label: str,
    value: str,
    subtitle: str,
    gradient: str,
    shadow: str,
) -> str:
    return f"""
    <div style="
        background:{gradient};
        border-radius:18px;
        padding:1.35rem 1.5rem;
        color:white;
        box-shadow:0 8px 28px {shadow};
        position:relative;
        overflow:hidden;
        min-height:126px;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        margin-bottom:.25rem;
    ">
      <div style="position:absolute;top:-28px;right:-28px;width:110px;height:110px;
                  border-radius:50%;background:rgba(255,255,255,.1);"></div>
      <div style="position:absolute;bottom:-40px;right:25px;width:90px;height:90px;
                  border-radius:50%;background:rgba(255,255,255,.07);"></div>
      <div style="z-index:1;">
        <div style="font-size:.66rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;opacity:.82;margin-bottom:.55rem;">
          {icon}&nbsp;&nbsp;{label}
        </div>
        <div style="font-size:2rem;font-weight:900;line-height:1.05;letter-spacing:-.02em;">
          {value}
        </div>
      </div>
      <div style="font-size:.71rem;opacity:.76;font-weight:400;z-index:1;margin-top:.25rem;">
        {subtitle}
      </div>
    </div>
    """
