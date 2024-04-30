import os
from dotenv import load_dotenv

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from databases import DatabaseURL
from starlette.config import Config
from starlette.datastructures import Secret

from api.routers import category, item, student, payment


load_dotenv(".env")

app = FastAPI(title="Ryuho Kiosk", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("ALLOWED_HOSTS"),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(category.router)
app.include_router(item.router)
app.include_router(student.router)
app.include_router(payment.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

"""
def get_url():
    user = os.getenv("POSTGRES_USER", "postgres")
    password = os.getenv("POSTGRES_PASSWORD", "")
    server = os.getenv("POSTGRES_SERVER", "db")
    db = os.getenv("POSTGRES_DB", "app")
    return f"postgresql+psycopg://{user}:{password}@{server}/{db}"
"""