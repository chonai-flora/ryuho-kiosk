import os
from dotenv import load_dotenv

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

load_dotenv(".env")

Engine = create_engine(
    os.environ.get("DATABASE_URL"),
    echo=False
)

ModelBase = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=Engine)