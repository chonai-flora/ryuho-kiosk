from sqlalchemy import create_engine, Column, String, Integer, Unicode, DateTime, ForeignKey

from .base import ModelBase


class CategoryModel(ModelBase):
    __tablename__ = 'category'

    id = Column(String(16), primary_key=True, unique=True)
    name = Column(String(32), nullable=False)