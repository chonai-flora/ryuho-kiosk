from fastapi import APIRouter, HTTPException
from sqlalchemy.exc import IntegrityError

from models.base import SessionLocal
from models.category import CategoryModel

router = APIRouter()


@router.get("/categories")
async def get_categories():
    db = SessionLocal()
    categories = db.query(CategoryModel).all()
    db.close()
    return categories


@router.get("/categories/{id}")
async def get_category(id: str):
    db = SessionLocal()
    category = db.query(CategoryModel).filter(CategoryModel.id == id).first()
    db.close()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.post("/categories")
async def create_category(id: str, name: str):
    db = SessionLocal()
    try:
        category = CategoryModel(id=id, name=name)
        db.add(category)
        db.commit()
        db.refresh(category)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Category name already exists")
    finally:
        db.close()
    return category


@router.put("/categories/{id}")
async def update_category(id: str, new_name: str):
    db = SessionLocal()
    category = db.query(CategoryModel).filter(CategoryModel.id == id).first()
    if category is None:
        db.close()
        raise HTTPException(status_code=404, detail="Category not found")
    category.name = new_name
    db.commit()
    db.refresh(category)
    db.close()
    return category


@router.delete("/categories/{id}")
async def delete_category(id: str):
    db = SessionLocal()
    category = db.query(CategoryModel).filter(CategoryModel.id == id).first()
    if category is None:
        db.close()
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(category)
    db.commit()
    db.close()
    return {"message": "Category deleted successfully"}
