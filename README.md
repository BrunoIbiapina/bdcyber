
# Banco de Dados Cyber

> Plataforma para análise, visualização e manipulação de dados de cibersegurança, composta por backend em Python (FastAPI) e frontend em Next.js/React.

---

## Sumário

- [Descrição](#descrição)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
  - [Backend (api-dashboard)](#backend-api-dashboard)
  - [Frontend (front-cyber)](#frontend-front-cyber)
- [Comandos Úteis](#comandos-úteis)
- [Testes](#testes)
- [Contribuição](#contribuição)
- [Problemas Comuns](#problemas-comuns)
- [Licença](#licença)
- [Contato](#contato)

---

## Descrição

O Banco de Dados Cyber é uma solução para ingestão, análise e visualização de dados de cibersegurança. O backend expõe uma API para manipulação e consulta dos dados, enquanto o frontend oferece dashboards interativos e filtros avançados.

## Tecnologias Utilizadas

- **Backend:** Python 3.10+, FastAPI, Pandas, Uvicorn
- **Frontend:** Next.js 14+, React, TypeScript, Chart.js
- **Outros:** CSV como fonte de dados, ambiente virtual Python, npm/yarn

## Estrutura do Projeto

```
├── api-dashboard/           # Backend FastAPI
│   ├── app/                 # Código-fonte backend
│   │   ├── config.py
│   │   ├── db.py
│   │   ├── loader.py
│   │   ├── main.py
│   │   ├── metrics.py
│   │   ├── queries.py
│   │   ├── schemas.py
│   │   ├── transform.py
│   │   └── ...
│   └── data/                # Dados CSV
│       └── dados.csv
├── front-cyber/
│   └── data-dash/           # Frontend Next.js
│       ├── app/
│       ├── src/
│       └── ...
├── requirements.txt         # Dependências Python
└── sample.csv               # Exemplo de dados
```

## Pré-requisitos

- Python 3.10 ou superior
- Node.js 18 ou superior
- npm ou yarn

## Instalação e Execução

### Backend (api-dashboard)

1. Crie e ative o ambiente virtual:
   ```bash
   cd api-dashboard
   python -m venv .venv
   source .venv/bin/activate
   ```
2. Instale as dependências:
   ```bash
   pip install -r ../requirements.txt
   ```
3. Execute o backend:
   ```bash
   uvicorn app.main:app --reload
   ```
   Acesse: http://localhost:8000

### Frontend (front-cyber)

1. Instale as dependências:
   ```bash
   cd front-cyber/data-dash
   npm install
   ```
2. Execute o frontend:
   ```bash
   npm run dev
   ```
   Acesse: http://localhost:3000

## Comandos Úteis

- Ativar ambiente virtual Python:
  ```bash
  source api-dashboard/.venv/bin/activate
  ```
- Instalar dependências Python:
  ```bash
  pip install -r requirements.txt
  ```
- Instalar dependências Node.js:
  ```bash
  npm install
  ```
- Rodar backend:
  ```bash
  uvicorn app.main:app --reload
  ```
- Rodar frontend:
  ```bash
  npm run dev
  ```

## Testes

### Backend
Se houver testes automatizados, rode:
```bash
pytest
```
ou
```bash
python -m unittest discover
```

### Frontend
Se houver testes, rode:
```bash
npm test
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Faça suas alterações e commit: `git commit -m 'feat: minha feature'`
4. Envie para seu fork: `git push origin minha-feature`
5. Abra um Pull Request

## Problemas Comuns

- **Porta ocupada:** Libere as portas 8000 (backend) e 3000 (frontend) se já estiverem em uso.
- **Dependências não instaladas:** Certifique-se de ativar o ambiente virtual e instalar todas as dependências.
- **Dados ausentes:** O arquivo `api-dashboard/data/dados.csv` deve existir e estar no formato esperado.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Contato

Bruno Ibiapina  
Email: brunoibiapina@gmail.com

---

Desenvolvido por Bruno Ibiapina.