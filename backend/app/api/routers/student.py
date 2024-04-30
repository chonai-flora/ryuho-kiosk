from fastapi import APIRouter, HTTPException
from sqlalchemy.exc import IntegrityError

from models.base import SessionLocal
from models.student import StudentModel

router = APIRouter()


@router.get("/students")
async def get_students():
    db = SessionLocal()
    students = db.query(StudentModel).all()
    db.close()
    return students


@router.get("/students/{id}")
async def get_student(id: str):
    db = SessionLocal()
    student = db.query(StudentModel).filter(StudentModel.id == id).first()
    db.close()
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.post("/students")
async def register_student(id: str, barcode: str):
    db = SessionLocal()
    try:
        student = StudentModel(id=id, barcode=barcode)
        db.add(student)
        db.commit()
        db.refresh(student)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Student barcode already exists")
    finally:
        db.close()
    return student


@router.put("/students/{id}")
async def update_student(id: str, new_barcode: str):
    db = SessionLocal()
    student = db.query(StudentModel).filter(StudentModel.id == id).first()
    if student is None:
        db.close()
        raise HTTPException(status_code=404, detail="Student not found")
    student.barcode = new_barcode
    db.commit()
    db.refresh(student)
    db.close()
    return student


@router.delete("/students/{id}")
async def delete_student(id: str):
    db = SessionLocal()
    student = db.query(StudentModel).filter(StudentModel.id == id).first()
    if student is None:
        db.close()
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    db.close()
    return {"message": "Student deleted successfully"}
