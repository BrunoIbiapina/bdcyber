# 📊 Dashboard Interativo — CSV Explorer

Dashboard moderno e responsivo construído com **Streamlit + Plotly + pandas**.
Carrega qualquer CSV, detecta o schema automaticamente e gera visualizações, filtros e insights sem configuração manual.

---

## Estrutura de Pastas

```
streamlit-dashboard/
├── app/
│   ├── main.py                  # Entry point do Streamlit
│   ├── components/
│   │   ├── charts.py            # Todos os gráficos Plotly
│   │   ├── filters.py           # Sidebar de filtros
│   │   ├── kpi_cards.py         # Cards de KPI
│   │   └── tables.py            # Tabela interativa + exportação
│   └── utils/
│       ├── cleaning.py          # Pipeline de limpeza
│       ├── io.py                # Leitura de CSV (encoding + separador)
│       ├── metrics.py           # KPIs e insights automáticos
│       └── schema.py            # Detecção automática de tipos
├── data/
│   └── dados.csv                # Dataset de exemplo (incidentes de segurança)
├── .streamlit/
│   └── config.toml              # Tema e configurações do Streamlit
└── requirements.txt
```

---

## Instalação e Execução

```bash
# 1. Entre na pasta do projeto
cd streamlit-dashboard

# 2. Crie e ative um ambiente virtual
python -m venv .venv
source .venv/bin/activate        # Linux/macOS
# .venv\Scripts\activate         # Windows

# 3. Instale as dependências
pip install -r requirements.txt

# 4. Rode o dashboard
streamlit run app/main.py
```

Abra **http://localhost:8501** no navegador.

---

## Como Usar

### Carregando Dados
| Forma | Detalhe |
|---|---|
| **Upload** | Use o botão "Carregar CSV" na sidebar |
| **Padrão** | Coloque seu arquivo em `data/dados.csv` (carregado automaticamente) |

### Detecção Automática
O app detecta:
- **Colunas numéricas** → KPIs, sliders, gráficos de dispersão, histogramas
- **Colunas categóricas** → filtros multiselect, barras, heatmaps
- **Colunas de data** → série temporal, heatmap dia×hora, date picker
- **Colunas lat/lon** → ativa aba "Mapa" automaticamente

### Abas
| Aba | Conteúdo |
|---|---|
| 🏠 Visão Geral | Série temporal + Top categorias |
| 📈 Análises | Dispersão + Boxplot |
| 🌡️ Heatmaps | Correlação numérica + Categórico + Temporal |
| 📊 Distribuições | Histograma + estatísticas descritivas |
| 📋 Tabela | Dados filtrados com paginação e exportação CSV/Excel |
| 🗺️ Mapa | Pontos geográficos (aparece só se houver lat/lon) |
| 💡 Insights | Alertas automáticos e correlações |
| 🔍 Qualidade | Missing %, outliers, schema detectado |

---

## Deploy (Streamlit Community Cloud)

1. Faça push do repositório para o GitHub
2. Acesse [share.streamlit.io](https://share.streamlit.io)
3. Clique em **New app** → selecione o repo
4. Main file path: `streamlit-dashboard/app/main.py`
5. Clique em **Deploy**

---

## Requisitos

| Pacote | Versão mínima |
|---|---|
| streamlit | 1.32 |
| pandas | 2.1 |
| plotly | 5.18 |
| openpyxl | 3.1 |
| statsmodels | 0.14 (regressão no scatter) |
