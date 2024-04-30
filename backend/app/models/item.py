import uuid

from sqlalchemy import create_engine, Column, String, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from .base import ModelBase
from .category import CategoryModel


class ItemModel(ModelBase):
    __tablename__ = 'item'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
    name = Column(String(64), nullable=False)
    price = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    category_id = Column(String(16), ForeignKey('category.id'))