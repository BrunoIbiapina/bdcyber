"""
All Plotly charts for the dashboard.

Each function returns a go.Figure or None when data is insufficient.
The caller is responsible for handling the None case.
"""
from __future__ import annotations

from typing import Optional

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

import plotly.io as pio
from app.utils.schema import Schema

# ── Custom theme ──────────────────────────────────────────────────────────────
PALETTE = [
    "#6366f1", "#0ea5e9", "#10b981", "#f59e0b",
    "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6",
    "#f97316", "#06b6d4",
]
COLOR_SCALE_SEQ = "Blues"
COLOR_SCALE_DIV = "RdBu_r"

_FONT = dict(family="Inter, system-ui, -apple-system, sans-serif", color="#334155")
_AXIS = dict(
    showgrid=True, gridcolor="#f1f5f9", gridwidth=1,
    linecolor="#e2e8f0", linewidth=1,
    tickfont=dict(size=11, color="#64748b"),
    title_font=dict(size=12, color="#475569", weight=600),
    zeroline=False,
)

_custom = go.layout.Template()
_custom.layout = go.Layout(
    font=_FONT,
    paper_bgcolor="white",
    plot_bgcolor="white",
    title=dict(
        font=dict(size=15, color="#0f172a", weight=700),
        x=0.01, xanchor="left",
        pad=dict(l=0, t=4, b=12),
    ),
    xaxis=_AXIS,
    yaxis=_AXIS,
    legend=dict(
        bgcolor="rgba(255,255,255,.95)",
        bordercolor="#e8edf5", borderwidth=1,
        font=dict(size=11, color="#475569"),
        title_font=dict(size=11, color="#64748b"),
    ),
    colorway=PALETTE,
    margin=dict(l=16, r=16, t=52, b=16),
    hoverlabel=dict(
        bgcolor="white",
        bordercolor="#e2e8f0",
        font=dict(size=12, color="#0f172a"),
    ),
    hovermode="closest",
)
pio.templates["cyber"] = _custom
TEMPLATE = "cyber"


def _empty_fig(msg: str = "Dados insuficientes para este gráfico") -> go.Figure:
    fig = go.Figure()
    fig.add_annotation(
        text=msg,
        xref="paper", yref="paper",
        x=0.5, y=0.5, showarrow=False,
        font=dict(size=15, color="#94a3b8"),
    )
    fig.update_layout(template=TEMPLATE, height=320, margin=dict(t=40, b=20))
    return fig


# ── Time Series ───────────────────────────────────────────────────────────────

def chart_time_series(
    df: pd.DataFrame,
    schema: Schema,
    freq: str = "ME",
) -> Optional[go.Figure]:
    if not schema.datetime or not schema.numeric:
        return None

    date_col = schema.datetime[0]
    num_col = schema.value_cols[0] if schema.value_cols else schema.numeric[0]
    cat_col = schema.categorical[0] if schema.categorical else None

    try:
        if cat_col:
            top_cats = df[cat_col].value_counts().head(8).index
            sub = df[df[cat_col].isin(top_cats)].copy()
            grouped = (
                sub.groupby([pd.Grouper(key=date_col, freq=freq), cat_col])[num_col]
                .sum()
                .reset_index()
            )
            fig = px.line(
                grouped, x=date_col, y=num_col, color=cat_col,
                title=f"{num_col} ao longo do tempo por {cat_col}",
                color_discrete_sequence=PALETTE,
                template=TEMPLATE,
                markers=True,
            )
        else:
            grouped = (
                df.set_index(date_col)[num_col]
                .resample(freq)
                .sum()
                .reset_index()
            )
            fig = px.area(
                grouped, x=date_col, y=num_col,
                title=f"{num_col} ao longo do tempo",
                color_discrete_sequence=[PALETTE[0]],
                template=TEMPLATE,
            )
        fig.update_layout(legend_title_text=cat_col or "", hovermode="x unified")
        return fig
    except Exception as exc:
        return _empty_fig(f"Erro na série temporal: {exc}")


# ── Bar charts ────────────────────────────────────────────────────────────────

def chart_top_categories(
    df: pd.DataFrame,
    schema: Schema,
    top_n: int = 10,
    cat_col: Optional[str] = None,
) -> Optional[go.Figure]:
    if not schema.categorical:
        return None
    col = cat_col or schema.categorical[0]
    vc = df[col].value_counts().head(top_n).reset_index()
    vc.columns = [col, "contagem"]

    fig = px.bar(
        vc, x=col, y="contagem",
        title=f"Top {top_n} — {col}",
        color=col,
        color_discrete_sequence=PALETTE,
        template=TEMPLATE,
        text="contagem",
    )
    fig.update_traces(textposition="outside")
    fig.update_layout(showlegend=False, xaxis_tickangle=-30)
    return fig


def chart_bar_sum(
    df: pd.DataFrame,
    schema: Schema,
    top_n: int = 10,
    cat_col: Optional[str] = None,
    num_col: Optional[str] = None,
) -> Optional[go.Figure]:
    if not schema.categorical or not schema.numeric:
        return None
    col = cat_col or schema.categorical[0]
    val = num_col or (schema.value_cols[0] if schema.value_cols else schema.numeric[0])

    agg = df.groupby(col)[val].sum().nlargest(top_n).reset_index()
    fig = px.bar(
        agg, x=col, y=val,
        title=f"Top {top_n} — {col} por {val} (soma)",
        color=col,
        color_discrete_sequence=PALETTE,
        template=TEMPLATE,
        text_auto=".3s",
    )
    fig.update_traces(textposition="outside")
    fig.update_layout(showlegend=False, xaxis_tickangle=-30)
    return fig


# ── Scatter ───────────────────────────────────────────────────────────────────

def chart_scatter(
    df: pd.DataFrame,
    schema: Schema,
    x_col: Optional[str] = None,
    y_col: Optional[str] = None,
) -> Optional[go.Figure]:
    if len(schema.numeric) < 2:
        return None
    x = x_col or schema.numeric[0]
    y = y_col or schema.numeric[1]
    color = schema.categorical[0] if schema.categorical else None

    sample = df.sample(min(3000, len(df)), random_state=42) if len(df) > 3000 else df

    fig = px.scatter(
        sample, x=x, y=y, color=color,
        title=f"Dispersão — {x} × {y}",
        color_discrete_sequence=PALETTE,
        template=TEMPLATE,
        opacity=0.72,
        trendline="ols",
    )
    return fig


# ── Box / Violin ──────────────────────────────────────────────────────────────

def chart_boxplot(
    df: pd.DataFrame,
    schema: Schema,
    num_col: Optional[str] = None,
    cat_col: Optional[str] = None,
) -> Optional[go.Figure]:
    if not schema.numeric:
        return None
    col = num_col or (schema.value_cols[0] if schema.value_cols else schema.numeric[0])
    cat = cat_col or (schema.categorical[0] if schema.categorical else None)

    if cat:
        top_cats = df[cat].value_counts().head(10).index
        data = df[df[cat].isin(top_cats)]
        fig = px.box(
            data, x=cat, y=col,
            color=cat,
            title=f"Distribuição de {col} por {cat}",
            color_discrete_sequence=PALETTE,
            template=TEMPLATE,
        )
    else:
        fig = px.box(
            df, y=col,
            title=f"Distribuição de {col}",
            color_discrete_sequence=[PALETTE[0]],
            template=TEMPLATE,
        )
    fig.update_layout(showlegend=False)
    return fig


# ── Histogram ─────────────────────────────────────────────────────────────────

def chart_histogram(
    df: pd.DataFrame,
    col: str,
    bins: int = 30,
    color_col: Optional[str] = None,
) -> go.Figure:
    if col not in df.columns:
        return _empty_fig("Coluna não encontrada")
    fig = px.histogram(
        df, x=col, nbins=bins,
        color=color_col,
        title=f"Distribuição — {col}",
        color_discrete_sequence=PALETTE,
        template=TEMPLATE,
        marginal="box",
        barmode="overlay",
    )
    fig.update_layout(bargap=0.05, legend_title_text=color_col or "")
    return fig


# ── Heatmaps ──────────────────────────────────────────────────────────────────

def chart_corr_heatmap(
    df: pd.DataFrame,
    schema: Schema,
) -> Optional[go.Figure]:
    if len(schema.numeric) < 2:
        return None
    corr = df[schema.numeric].corr().round(2)
    fig = px.imshow(
        corr,
        text_auto=True,
        color_continuous_scale=COLOR_SCALE_DIV,
        title="Heatmap de Correlação",
        template=TEMPLATE,
        aspect="auto",
        zmin=-1, zmax=1,
    )
    fig.update_coloraxes(colorbar_title="Pearson r")
    return fig


def chart_cat_heatmap(
    df: pd.DataFrame,
    schema: Schema,
    col1: Optional[str] = None,
    col2: Optional[str] = None,
) -> Optional[go.Figure]:
    if len(schema.categorical) < 2:
        return None
    c1 = col1 or schema.categorical[0]
    c2 = col2 or schema.categorical[1]

    top1 = df[c1].value_counts().head(12).index
    top2 = df[c2].value_counts().head(12).index
    sub = df[df[c1].isin(top1) & df[c2].isin(top2)]
    pivot = sub.groupby([c1, c2]).size().unstack(fill_value=0)

    fig = px.imshow(
        pivot,
        text_auto=True,
        color_continuous_scale=COLOR_SCALE_SEQ,
        title=f"Heatmap — {c1} × {c2}",
        template=TEMPLATE,
        aspect="auto",
    )
    return fig


def chart_temporal_heatmap(
    df: pd.DataFrame,
    schema: Schema,
) -> Optional[go.Figure]:
    if not schema.datetime:
        return None
    date_col = schema.datetime[0]
    num_col = schema.value_cols[0] if schema.value_cols else (
        schema.numeric[0] if schema.numeric else None
    )

    try:
        tmp = df[[date_col]].copy()
        tmp["day_of_week"] = df[date_col].dt.day_name()
        hours = df[date_col].dt.hour
        has_time = hours.nunique() > 1

        if has_time:
            tmp["hour"] = hours
            if num_col:
                tmp[num_col] = df[num_col].values
                pivot = tmp.groupby(["day_of_week", "hour"])[num_col].mean().unstack(fill_value=0)
                title = f"Heatmap Temporal — Dia × Hora ({num_col} médio)"
            else:
                pivot = tmp.groupby(["day_of_week", "hour"]).size().unstack(fill_value=0)
                title = "Heatmap Temporal — Dia × Hora (contagem)"
        else:
            # No time component: day-of-week × month
            tmp["month"] = df[date_col].dt.month_name()
            if num_col:
                tmp[num_col] = df[num_col].values
                pivot = tmp.groupby(["day_of_week", "month"])[num_col].mean().unstack(fill_value=0)
                title = f"Heatmap Temporal — Dia × Mês ({num_col} médio)"
            else:
                pivot = tmp.groupby(["day_of_week", "month"]).size().unstack(fill_value=0)
                title = "Heatmap Temporal — Dia × Mês (contagem)"

        day_order = [
            "Monday", "Tuesday", "Wednesday", "Thursday",
            "Friday", "Saturday", "Sunday",
        ]
        pivot = pivot.reindex([d for d in day_order if d in pivot.index])

        fig = px.imshow(
            pivot,
            color_continuous_scale="Viridis",
            title=title,
            template=TEMPLATE,
            aspect="auto",
        )
        return fig
    except Exception:
        return None


# ── Map ───────────────────────────────────────────────────────────────────────

def chart_map(
    df: pd.DataFrame,
    schema: Schema,
    map_style: str = "carto-positron",
    size_col: Optional[str] = None,
) -> Optional[go.Figure]:
    if schema.lat is None or schema.lon is None:
        return None

    lat_col = schema.lat
    lon_col = schema.lon
    color_col = schema.categorical[0] if schema.categorical else None
    if size_col is None:
        size_col = schema.value_cols[0] if schema.value_cols else None

    sample = (
        df.sample(min(5_000, len(df)), random_state=42)
        .dropna(subset=[lat_col, lon_col])
    )

    # Clamp realistic lat/lon
    sample = sample[
        sample[lat_col].between(-90, 90) & sample[lon_col].between(-180, 180)
    ]

    if sample.empty:
        return _empty_fig("Sem coordenadas válidas para exibir no mapa")

    fig = px.scatter_mapbox(
        sample,
        lat=lat_col,
        lon=lon_col,
        color=color_col,
        size=size_col,
        size_max=14,
        zoom=3,
        mapbox_style=map_style,
        title="Distribuição Geográfica",
        color_discrete_sequence=PALETTE,
        template=TEMPLATE,
        opacity=0.8,
    )
    fig.update_layout(margin=dict(l=0, r=0, t=40, b=0))
    return fig
