"""
Dashboard Interativo — entry point Streamlit.

Execução:
    cd streamlit-dashboard
    streamlit run app/main.py
"""
from __future__ import annotations

import logging
import sys
from pathlib import Path
from typing import Optional

import pandas as pd
import plotly.express as px
import streamlit as st

_ROOT = Path(__file__).parent.parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from app.components.charts import (
    chart_bar_sum,
    chart_boxplot,
    chart_cat_heatmap,
    chart_corr_heatmap,
    chart_histogram,
    chart_map,
    chart_scatter,
    chart_temporal_heatmap,
    chart_time_series,
    _empty_fig,
)
from app.components.filters import render_sidebar_filters
from app.components.kpi_cards import render_kpi_cards
from app.components.tables import render_table_tab
from app.utils.cleaning import clean_dataframe
from app.utils.io import DEFAULT_CSV_PATH, read_path, load_csv
from app.utils.metrics import generate_insights
from app.utils.schema import Schema

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


# ── CSS ────────────────────────────────────────────────────────────────────────

_CSS = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* ── Global ── */
html, body, [class*="css"], * { font-family: 'Inter', system-ui, sans-serif !important; }
#MainMenu, footer, [data-testid="stToolbar"], [data-testid="stDeployButton"] { visibility: hidden !important; display: none !important; }

.stApp { background: #f0f4ff !important; }
.block-container { padding: 3.5rem 2rem 3rem 2rem !important; max-width: 1440px !important; }

/* ── Sidebar (dark navy) ── */
[data-testid="stSidebar"] {
    background: linear-gradient(180deg, #0d1117 0%, #161b27 60%, #0d1117 100%) !important;
    border-right: 1px solid rgba(99,102,241,.18) !important;
    box-shadow: 4px 0 24px rgba(0,0,0,.18) !important;
}
[data-testid="stSidebar"] p,
[data-testid="stSidebar"] label,
[data-testid="stSidebar"] span:not([data-testid]),
[data-testid="stSidebar"] div { color: #c8d3e8 !important; }

[data-testid="stSidebar"] h2 {
    color: #f1f5f9 !important; font-weight: 800 !important;
    font-size: 1.05rem !important; letter-spacing: -0.01em;
}
[data-testid="stSidebar"] h3 {
    color: #818cf8 !important; font-weight: 700 !important;
    font-size: 0.7rem !important; text-transform: uppercase !important;
    letter-spacing: 0.1em !important; margin: 1.4rem 0 0.4rem !important;
}
[data-testid="stSidebar"] [data-baseweb="select"] > div {
    background: rgba(255,255,255,.06) !important;
    border-color: rgba(255,255,255,.1) !important;
    border-radius: 10px !important;
    color: #e2e8f0 !important;
}
[data-testid="stSidebar"] [data-testid="stTextInput"] > div > div {
    background: rgba(255,255,255,.06) !important;
    border-color: rgba(255,255,255,.1) !important;
    border-radius: 10px !important; color: #e2e8f0 !important;
}
[data-testid="stSidebar"] [data-testid="stFileUploader"] > div {
    background: rgba(255,255,255,.04) !important;
    border: 1.5px dashed rgba(99,102,241,.45) !important;
    border-radius: 12px !important;
}
[data-testid="stSidebar"] hr { border-color: rgba(255,255,255,.08) !important; margin: 1rem 0 !important; }
[data-testid="stSidebar"] [data-testid="stAlert"] {
    background: rgba(99,102,241,.12) !important;
    border: 1px solid rgba(99,102,241,.3) !important;
    border-radius: 10px !important; color: #c7d2fe !important;
}
[data-testid="stSidebar"] [data-testid="stMarkdownContainer"] p { color: #94a3b8 !important; }
/* success */
[data-testid="stSidebar"] [data-testid="stAlert"][kind="success"] {
    background: rgba(16,185,129,.1) !important;
    border-color: rgba(16,185,129,.3) !important; color: #6ee7b7 !important;
}
/* Slider track */
[data-testid="stSidebar"] [role="slider"] { background: #6366f1 !important; }

/* ── Tabs ── */
[data-baseweb="tab-list"] {
    background: #eef2ff !important;
    border-radius: 14px !important;
    padding: 5px !important;
    gap: 3px !important;
    box-shadow: none !important;
    border: none !important;
    justify-content: center !important;
}
[data-baseweb="tab"] {
    background: transparent !important;
    border-radius: 10px !important;
    font-weight: 500 !important;
    font-size: 0.82rem !important;
    color: #64748b !important;
    padding: 0.42rem 1.05rem !important;
    border: none !important;
    transition: all .15s ease !important;
    outline: none !important;
    letter-spacing: 0 !important;
}
[data-baseweb="tab"]:hover:not([aria-selected="true"]) {
    background: rgba(255,255,255,.65) !important;
    color: #374151 !important;
}
[aria-selected="true"][data-baseweb="tab"] {
    background: white !important;
    color: #6366f1 !important;
    font-weight: 700 !important;
    box-shadow: 0 1px 6px rgba(15,23,42,.1) !important;
}

/* ── Chart containers ── */
[data-testid="stPlotlyChart"] > div {
    background: white !important; border-radius: 18px !important;
    padding: 0.5rem !important;
    box-shadow: 0 2px 14px rgba(15,23,42,.07) !important;
    border: 1px solid #eaf0fb !important;
}

/* ── Dataframe ── */
[data-testid="stDataFrame"] {
    border-radius: 14px !important; overflow: hidden !important;
    box-shadow: 0 2px 12px rgba(15,23,42,.06) !important;
    border: 1px solid #eaf0fb !important;
}

/* ── Inputs & selects (main) ── */
[data-baseweb="select"] > div {
    border-radius: 10px !important; border-color: #e2e8f0 !important;
    background: white !important; font-size: 0.88rem !important;
}
[data-testid="stTextInput"] > div > div { border-radius: 10px !important; }
.stSlider [data-baseweb="slider"] { padding: 0 !important; }

/* ── Alerts ── */
[data-testid="stAlert"] { border-radius: 12px !important; font-size: 0.87rem !important; }

/* ── Download buttons ── */
[data-testid="stDownloadButton"] button {
    background: white !important; border: 1.5px solid #6366f1 !important;
    color: #6366f1 !important; border-radius: 10px !important;
    font-weight: 600 !important; font-size: 0.85rem !important;
    padding: 0.4rem 1rem !important;
    transition: all .15s ease !important;
}
[data-testid="stDownloadButton"] button:hover {
    background: #6366f1 !important; color: white !important;
    box-shadow: 0 4px 12px rgba(99,102,241,.35) !important;
}

/* ── Caption ── */
.stCaption, [data-testid="stCaptionContainer"] p {
    color: #94a3b8 !important; font-size: 0.78rem !important;
}

/* ── Divider ── */
hr { border-color: #e8edf5 !important; margin: 0.75rem 0 !important; }

/* ── Section headings inside tabs ── */
[data-testid="stMarkdownContainer"] h3 {
    color: #0f172a !important; font-size: 1.15rem !important;
    font-weight: 700 !important; letter-spacing: -0.02em !important;
    margin-bottom: 0.25rem !important;
}

/* ── Selectbox label ── */
[data-testid="stSelectbox"] label { font-weight: 600 !important; font-size: 0.82rem !important; color: #475569 !important; }

/* ── Multiselect tags ── */
[data-baseweb="tag"] { background: rgba(99,102,241,.15) !important; border-radius: 6px !important; }
[data-baseweb="tag"] span { color: #4f46e5 !important; font-weight: 600 !important; }

/* ── Radio right-aligned (used in title rows) ── */
[data-testid="stColumn"]:last-child [data-testid="stRadio"] [role="radiogroup"] {
    margin-left: auto !important;
}

/* ── Segmented radio (pill style igual às tabs) ── */
[data-testid="stRadio"] > label {
    font-weight: 600 !important; font-size: 0.82rem !important; color: #475569 !important;
    margin-bottom: .35rem !important;
}
[data-testid="stRadio"] [role="radiogroup"] {
    display: flex !important;
    flex-direction: row !important;
    gap: 3px !important;
    background: #eef2ff !important;
    border-radius: 12px !important;
    padding: 5px !important;
    width: fit-content !important;
    flex-wrap: wrap !important;
}
[data-testid="stRadio"] [role="radiogroup"] > label {
    background: transparent !important;
    border-radius: 9px !important;
    padding: 0.38rem 0.95rem !important;
    cursor: pointer !important;
    margin: 0 !important;
    transition: all .15s ease !important;
}
[data-testid="stRadio"] [role="radiogroup"] > label > div:first-child { display: none !important; }
[data-testid="stRadio"] [role="radiogroup"] > label p {
    font-size: 0.82rem !important; font-weight: 500 !important;
    color: #64748b !important; margin: 0 !important;
}
[data-testid="stRadio"] [role="radiogroup"] > label:has(input:checked) {
    background: white !important;
    box-shadow: 0 1px 6px rgba(15,23,42,.1) !important;
}
[data-testid="stRadio"] [role="radiogroup"] > label:has(input:checked) p {
    color: #6366f1 !important; font-weight: 700 !important;
}
</style>
"""


# ── Page config ────────────────────────────────────────────────────────────────

def _configure_page() -> None:
    st.set_page_config(
        page_title="Dashboard Interativo",
        page_icon="📊",
        layout="wide",
        initial_sidebar_state="expanded",
        menu_items={"About": "Dashboard interativo gerado automaticamente a partir de CSV."},
    )
    st.markdown(_CSS, unsafe_allow_html=True)




# ── Data loading ───────────────────────────────────────────────────────────────

def _load_data(uploaded_file) -> tuple[Optional[pd.DataFrame], Optional[Schema], Optional[dict], str]:
    if uploaded_file is not None:
        raw = uploaded_file.getvalue()
        filename = uploaded_file.name
        df_raw, msg = load_csv(raw)
    elif DEFAULT_CSV_PATH.exists():
        df_raw, msg = read_path(DEFAULT_CSV_PATH)
        filename = DEFAULT_CSV_PATH.name
    else:
        return None, None, None, ""

    if df_raw is None or df_raw.empty:
        st.error(f"Não foi possível ler o arquivo: {msg}")
        return None, None, None, ""

    logger.info("Dataset: %d × %d  |  %s", len(df_raw), len(df_raw.columns), msg)
    df, schema, quality = clean_dataframe(df_raw)
    return df, schema, quality, filename


# ── Quality tab ────────────────────────────────────────────────────────────────

def _render_quality_tab(quality: dict, schema: Schema) -> None:
    st.markdown("### Relatório de Qualidade")

    c1, c2, c3 = st.columns(3)
    _mini_stat(c1, "Total de Linhas", f"{quality['total_rows']:,}", "#6366f1")
    _mini_stat(c2, "Linhas Duplicadas", f"{quality['duplicates']:,}", "#f59e0b")
    _mini_stat(c3, "Outliers (IQR×1.5)", f"{sum(quality['outliers'].values()):,}", "#ef4444")

    st.markdown("<br>", unsafe_allow_html=True)

    missing_df = (
        pd.DataFrame.from_dict(quality["missing_pct"], orient="index", columns=["% Ausente"])
        .sort_values("% Ausente", ascending=False)
    )
    missing_df = missing_df[missing_df["% Ausente"] > 0]

    st.markdown("#### Dados Ausentes por Coluna")
    if missing_df.empty:
        st.success("✅ Nenhum valor ausente encontrado!")
    else:
        fig = px.bar(
            missing_df.reset_index().rename(columns={"index": "Coluna"}),
            x="Coluna", y="% Ausente",
            color="% Ausente", color_continuous_scale="Reds",
            text_auto=".1f", template="plotly_white",
        )
        fig.update_traces(textposition="outside")
        fig.update_layout(margin=dict(t=30, b=10, l=10, r=10))
        st.plotly_chart(fig, use_container_width=True)

    if quality["outliers"]:
        st.markdown("#### Outliers por Coluna")
        out_df = (
            pd.DataFrame.from_dict(quality["outliers"], orient="index", columns=["# Outliers"])
            .reset_index().rename(columns={"index": "Coluna"})
            .sort_values("# Outliers", ascending=False)
        )
        st.dataframe(out_df, use_container_width=True, hide_index=True)

    st.markdown("#### Schema Detectado")
    rows = []
    icons = {"🔢 Numérica": schema.numeric, "🏷️ Categórica": schema.categorical, "📅 Data/Hora": schema.datetime}
    for label, cols in icons.items():
        for col in cols:
            rows.append({"Coluna": col, "Tipo": label})
    if schema.lat:
        rows.append({"Coluna": schema.lat, "Tipo": "🗺️ Latitude"})
    if schema.lon:
        rows.append({"Coluna": schema.lon, "Tipo": "🗺️ Longitude"})
    if rows:
        st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)


def _mini_stat(col, label: str, value: str, color: str) -> None:
    col.markdown(
        f"""<div style="background:white;border-radius:14px;padding:1.1rem 1.2rem;
        border-left:4px solid {color};box-shadow:0 2px 10px rgba(15,23,42,.07);
        border-top:1px solid #eaf0fb;border-right:1px solid #eaf0fb;border-bottom:1px solid #eaf0fb;">
          <div style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:.4rem;">{label}</div>
          <div style="font-size:1.8rem;font-weight:800;color:#0f172a;">{value}</div>
        </div>""",
        unsafe_allow_html=True,
    )


# ── Main ───────────────────────────────────────────────────────────────────────

def main() -> None:
    _configure_page()

    # ── Sidebar ────────────────────────────────────────────────────────────────
    with st.sidebar:
        st.markdown(
            """<div style="display:flex;align-items:center;gap:.6rem;padding:.5rem 0 .25rem;">
              <span style="font-size:1.4rem;">📊</span>
              <span style="font-size:1rem;font-weight:800;color:#f1f5f9;letter-spacing:-.01em;">Cyber Dashboard</span>
            </div>""",
            unsafe_allow_html=True,
        )
        st.markdown("---")
        uploaded = st.file_uploader(
            "Carregar CSV",
            type=["csv"],
            help="Faça upload de um CSV. Sem upload, usa `data/dados.csv`.",
        )
        st.markdown("---")

    # ── Load data ──────────────────────────────────────────────────────────────
    df_full, schema, quality, filename = _load_data(uploaded)

    if df_full is None or df_full.empty:
        st.markdown("<div style='height:3rem'></div>", unsafe_allow_html=True)
        st.info("Carregue um CSV pela sidebar ou coloque um arquivo em `data/dados.csv`.")
        st.stop()

    # ── Sidebar filters ────────────────────────────────────────────────────────
    df = render_sidebar_filters(df_full, schema)

    if df.empty:
        st.warning("⚠️ Nenhum dado após os filtros. Ajuste os filtros na sidebar.")
        st.stop()

    # ── Header ─────────────────────────────────────────────────────────────────


    # ── Value column (selector lives in Mapa tab; KPI cards read from session state) ──
    _vc_default: Optional[str] = None
    if schema.numeric:
        _vc_default = schema.value_cols[0] if schema.value_cols else schema.numeric[0]
    value_col: Optional[str] = st.session_state.get("global_value_col", _vc_default)

    st.markdown("<div style='height:.5rem'></div>", unsafe_allow_html=True)

    # ── KPI Cards ──────────────────────────────────────────────────────────────
    render_kpi_cards(df, schema, value_col)

    st.markdown("<div style='height:1.25rem'></div>", unsafe_allow_html=True)

    # ── Tabs ───────────────────────────────────────────────────────────────────
    has_map = schema.lat is not None and schema.lon is not None
    tab_names = [
        "Visão Geral",
        "Análises",
        "Heatmaps",
        "Distribuições",
        "Tabela",
        "Insights",
        "Qualidade",
    ]
    if has_map:
        tab_names.insert(5, "Mapa")

    tabs = st.tabs(tab_names)
    tab_iter = iter(tabs)

    # ── Tab: Visão Geral ───────────────────────────────────────────────────────
    with next(tab_iter):
        st.markdown("### Visão Geral")
        if schema.datetime and schema.numeric:
            freq_map = {"Diário": "D", "Semanal": "W", "Mensal": "ME", "Trimestral": "QE", "Anual": "YE"}
            freq_label = st.radio(
                "Agregação temporal",
                list(freq_map.keys()),
                index=2,
                key="ts_freq",
                horizontal=True,
            )
            fig_ts = chart_time_series(df, schema, freq=freq_map[freq_label])
            if fig_ts:
                st.plotly_chart(fig_ts, use_container_width=True)
        else:
            st.info("ℹ️ Sem coluna de data disponível para série temporal.")

        if schema.categorical:
            cat_col_ov = st.radio(
                "Categoria",
                schema.categorical,
                index=0,
                key="overview_cat_col",
                horizontal=True,
            )
        else:
            cat_col_ov = None

        col_left, col_right = st.columns(2)
        with col_left:
            if cat_col_ov:
                from app.components.charts import chart_top_categories
                fig_cat = chart_top_categories(df, schema, cat_col=cat_col_ov)
                if fig_cat:
                    st.plotly_chart(fig_cat, use_container_width=True, key=f"ov_top_cat_{cat_col_ov}")
            else:
                st.info("ℹ️ Sem colunas categóricas.")
        with col_right:
            fig_sum = chart_bar_sum(df, schema, cat_col=cat_col_ov)
            if fig_sum:
                st.plotly_chart(fig_sum, use_container_width=True, key=f"ov_bar_sum_{cat_col_ov}")
            else:
                st.info("ℹ️ Sem colunas numéricas para soma.")

    # ── Tab: Análises ──────────────────────────────────────────────────────────
    with next(tab_iter):
        st.markdown("### Análises")
        col_l, col_r = st.columns(2)
        with col_l:
            if len(schema.numeric) >= 2:
                x_col = st.selectbox("Eixo X", schema.numeric, index=0, key="scatter_x")
                y_opts = [c for c in schema.numeric if c != x_col]
                y_col = st.selectbox("Eixo Y", y_opts, index=0, key="scatter_y") if y_opts else None
                if y_col:
                    fig_sc = chart_scatter(df, schema, x_col=x_col, y_col=y_col)
                    if fig_sc:
                        st.plotly_chart(fig_sc, use_container_width=True)
            else:
                st.info("ℹ️ Dispersão requer ≥ 2 colunas numéricas.")
        with col_r:
            fig_box = chart_boxplot(df, schema)
            if fig_box:
                st.plotly_chart(fig_box, use_container_width=True)
            else:
                st.info("ℹ️ Sem dados para boxplot.")

    # ── Tab: Heatmaps ──────────────────────────────────────────────────────────
    with next(tab_iter):
        st.markdown("### Heatmaps")
        fig_corr = chart_corr_heatmap(df, schema)
        if fig_corr:
            st.plotly_chart(fig_corr, use_container_width=True)
        else:
            st.info("ℹ️ Heatmap de correlação requer ≥ 2 colunas numéricas.")

        col_l, col_r = st.columns(2)
        with col_l:
            fig_ch = chart_cat_heatmap(df, schema)
            if fig_ch:
                st.plotly_chart(fig_ch, use_container_width=True)
            else:
                st.info("ℹ️ Requer ≥ 2 colunas categóricas.")
        with col_r:
            fig_th = chart_temporal_heatmap(df, schema)
            if fig_th:
                st.plotly_chart(fig_th, use_container_width=True)
            else:
                st.info("ℹ️ Sem coluna de data para heatmap temporal.")

    # ── Tab: Distribuições ─────────────────────────────────────────────────────
    with next(tab_iter):
        st.markdown("### Distribuições")
        if schema.numeric:
            col_ctrl, col_stats = st.columns([3, 1])
            with col_ctrl:
                hist_col = st.selectbox("Coluna numérica", schema.numeric, key="hist_col")
                c1, c2 = st.columns(2)
                with c1:
                    bins = st.slider("Bins", 5, 100, 30, key="hist_bins")
                with c2:
                    color_by = st.selectbox("Cor por categoria", ["(nenhuma)"] + schema.categorical, key="hist_color")
                color_col_arg = None if color_by == "(nenhuma)" else color_by
            with col_stats:
                series = df[hist_col].dropna()
                st.markdown(
                    f"""<div style="background:white;border-radius:14px;padding:1rem 1.2rem;
                    box-shadow:0 2px 10px rgba(15,23,42,.07);border:1px solid #eaf0fb;margin-top:1.75rem;">
                    <div style="font-size:.7rem;font-weight:700;text-transform:uppercase;color:#94a3b8;letter-spacing:.06em;margin-bottom:.75rem;">Estatísticas</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;">
                      <div><div style="font-size:.65rem;color:#94a3b8;">N</div><div style="font-weight:700;color:#0f172a;">{len(series):,}</div></div>
                      <div><div style="font-size:.65rem;color:#94a3b8;">Média</div><div style="font-weight:700;color:#6366f1;">{series.mean():.3g}</div></div>
                      <div><div style="font-size:.65rem;color:#94a3b8;">Mediana</div><div style="font-weight:700;color:#0f172a;">{series.median():.3g}</div></div>
                      <div><div style="font-size:.65rem;color:#94a3b8;">Desvio</div><div style="font-weight:700;color:#0f172a;">{series.std():.3g}</div></div>
                      <div><div style="font-size:.65rem;color:#94a3b8;">Mín</div><div style="font-weight:700;color:#10b981;">{series.min():.3g}</div></div>
                      <div><div style="font-size:.65rem;color:#94a3b8;">Máx</div><div style="font-weight:700;color:#ef4444;">{series.max():.3g}</div></div>
                    </div></div>""",
                    unsafe_allow_html=True,
                )
            fig_hist = chart_histogram(df, hist_col, bins=bins, color_col=color_col_arg)
            st.plotly_chart(fig_hist, use_container_width=True)

            with st.expander("Estatísticas Descritivas Completas"):
                st.dataframe(df[schema.numeric].describe().T.round(3), use_container_width=True)
        else:
            st.info("ℹ️ Sem colunas numéricas para distribuição.")

    # ── Tab: Tabela ────────────────────────────────────────────────────────────
    with next(tab_iter):
        render_table_tab(df)

    # ── Tab: Mapa (condicional) ────────────────────────────────────────────────
    if has_map:
        with next(tab_iter):
            _MAP_STYLES = {
                "Claro":    "carto-positron",
                "Escuro":   "carto-darkmatter",
                "Satélite": "open-street-map",
            }
            col_map_title, col_map_style = st.columns([3, 2])
            with col_map_title:
                st.markdown("### Mapa Geográfico")
            with col_map_style:
                map_style_label = st.radio(
                    "Estilo do mapa",
                    list(_MAP_STYLES.keys()),
                    index=0,
                    key="map_style",
                    horizontal=True,
                    label_visibility="collapsed",
                )

            if schema.numeric:
                _kpi_default_idx = 0
                if _vc_default in schema.numeric:
                    _kpi_default_idx = schema.numeric.index(_vc_default)
                st.radio(
                    "Coluna de valor para KPIs:",
                    options=schema.numeric,
                    index=_kpi_default_idx,
                    key="global_value_col",
                    horizontal=True,
                )

            _selected_size = st.session_state.get("global_value_col", _vc_default)
            fig_map = chart_map(df, schema, map_style=_MAP_STYLES[map_style_label], size_col=_selected_size)
            if fig_map:
                st.plotly_chart(fig_map, use_container_width=True)
                st.caption(f"Exibindo até 5.000 pontos de {len(df):,} registros filtrados.")
            else:
                st.info("ℹ️ Sem coordenadas válidas.")

    # ── Tab: Insights ──────────────────────────────────────────────────────────
    with next(tab_iter):
        st.markdown("### Insights Automáticos")
        insights = generate_insights(df, schema)
        for ins in insights:
            st.markdown(
                f"""<div style="background:white;border-radius:12px;padding:.9rem 1.2rem;
                margin:.4rem 0;border-left:3px solid #6366f1;
                box-shadow:0 1px 6px rgba(15,23,42,.06);font-size:.9rem;color:#1e293b;">
                {ins}</div>""",
                unsafe_allow_html=True,
            )

        if schema.numeric:
            st.markdown("<br>", unsafe_allow_html=True)
            with st.expander("Correlações numéricas"):
                st.dataframe(df[schema.numeric].corr().round(2), use_container_width=True)

    # ── Tab: Qualidade ─────────────────────────────────────────────────────────
    with next(tab_iter):
        _render_quality_tab(quality, schema)



if __name__ == "__main__":
    main()
