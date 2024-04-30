from fastapi import APIRouter, HTTPException
from typing_extensions import TypedDict
from sqlalchemy.orm import Session
from uuid import uuid4, UUID
from typing import List

from models.base import SessionLocal
from models.category import CategoryModel
from models.item import ItemModel

router = APIRouter()


@router.get("/items")
async def get_items():
    db = SessionLocal()
    items = db.query(ItemModel).all()
    db.close()
    return items


@router.get("/items/{id}")
async def get_item(id: UUID):
    db = SessionLocal()
    item = db.query(ItemModel).filter(ItemModel.id == id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    db.close()
    return item


@router.post("/items")
async def create_item(name: str, price: int, quantity: int, category_id: str):
    if price < 1:
        raise HTTPException(status_code=400, detail="Price must be 1 or more")

    if quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be 1 or more")

    db = SessionLocal()
    category = db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail=f"Category with id {category_id} not found")

    item = ItemModel(
        id=uuid4(),
        name=name,
        price=price,
        quantity=quantity,
        category_id=category.id
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    db.close()
    return item


@router.get("/items/category/{category_id}")
async def get_items_by_category_id(category_id: str):
    db = SessionLocal()
    items = db.query(ItemModel).filter(ItemModel.category_id == category_id).all()
    db.close()
    return items


@router.put("/items/{id}/set_quantity")
async def set_quantity(id: UUID, new_quantity: int):
    db = SessionLocal()
    item = db.query(ItemModel).filter(ItemModel.id == id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    if new_quantity < 0:
        raise HTTPException(status_code=400, detail="Quantity must be 0 or a positive number")
    item.quantity = new_quantity
    db.commit()
    db.close()
    return {"message": f"New quantity set successfully"}


@router.put("/items/{id}/decrement_quantity")
async def decrement_quantity(id: UUID, quantity_to_decrement: int):
    db = SessionLocal()
    item = db.query(ItemModel).filter(ItemModel.id == id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.quantity < quantity_to_decrement:
        raise HTTPException(status_code=400, detail="Not enough quantity to decrement")
    item.quantity -= quantity_to_decrement
    db.commit()
    db.close()
    return {"message": f"Quantity of item {id} decremented by {quantity_to_decrement}"}


class OrderItem(TypedDict):
    id: UUID
    order_quantity: int

@router.put("/items/decrement_inventory")
async def decrement_inventory(order_items: List[OrderItem]):
    db = SessionLocal()
    for order_item in order_items:
        item_id = order_item.get('id')
        order_quantity = order_item.get('order_quantity')

        item = db.query(ItemModel).filter(ItemModel.id == item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail=f"Item with id {item_id} not found")

        try:
            await decrement_quantity(item_id, order_quantity)
        except HTTPException as e:
            raise e

    db.commit()
    db.close()

    return {"message": "Inventory decremented successfully"}


@router.delete("/items/{id}")
async def delete_item(id: UUID):
    db = SessionLocal()
    item = db.query(ItemModel).filter(ItemModel.id == id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    db.close()
    return {"message": f"Item {id} deleted successfully"}
