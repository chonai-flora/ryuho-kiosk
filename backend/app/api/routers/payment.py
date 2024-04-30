import os
import datetime
from dotenv import load_dotenv
from typing import List, Union
from typing_extensions import TypedDict

import paypayopa
from fastapi import APIRouter, HTTPException
from sqlalchemy.exc import IntegrityError

from models.base import SessionLocal


load_dotenv(".env")

client = paypayopa.Client(
    auth=(os.environ.get("PAYPAY_API_KEY"), os.environ.get("PAYPAY_CLIENT_SECRET")), 
    production_mode=False
)
client.set_assume_merchant(os.environ.get("PAYPAY_MERCHANT_ID"))

router = APIRouter()


class UnitPrice(TypedDict):
    amount: int
    currency: str

class OrderItem(TypedDict):
    name: str
    category: str
    quantity: int
    productId: str
    unitPrice: UnitPrice

@router.post("/payments")
async def make_payment(order_items: List[OrderItem], description: Union[str, None], redirect_url: str):
    now = datetime.datetime.now()
    merchant_id = "0000000-" + now.strftime("%Y%m%d%H%M%S")
    total_amount = sum(item["quantity"] * item["unitPrice"]["amount"] for item in order_items)
    
    try:
        request = {
            "merchantPaymentId": merchant_id,
            "codeType": "ORDER_QR",
            "redirectUrl": redirect_url,
            "redirectType": "WEB_LINK",
            "orderDescription": description,
            "orderItems": order_items,
            "amount": {
                "amount": total_amount,
                "currency": "JPY"
            }
        }

        response = client.Code.create_qr_code(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))