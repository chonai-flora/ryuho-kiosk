from sqlalchemy import create_engine, Column, String, Integer, Unicode, DateTime, ForeignKey

from .base import ModelBase


class StudentModel(ModelBase):
    __tablename__ = 'student'

    id = Column(String(8), primary_key=True, unique=True)
    barcode = Column(String(16), nullable=False)