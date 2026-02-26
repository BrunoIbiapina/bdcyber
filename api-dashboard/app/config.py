from dotenv import load_dotenv
import os

load_dotenv()

CSV_PATH = os.getenv("CSV_PATH", "./data/dados.csv")
CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")]

ID_COL = os.getenv("ID_COL", "id")
DATE_COL = os.getenv("DATE_COL", "Timestamp")
VALUE_COL = os.getenv("VALUE_COL", "valor")
CATEGORY_COL = os.getenv("CATEGORY_COL", "categoria")
STATUS_COL = os.getenv("STATUS_COL", "status")
USER_COL = os.getenv("USER_COL", "usuario")
SOURCE_COL = os.getenv("SOURCE_COL", "origem")