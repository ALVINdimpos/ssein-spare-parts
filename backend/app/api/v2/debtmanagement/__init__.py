from fastapi import APIRouter
from app.api.v2.debtmanagement import debtors

router = APIRouter()

router.include_router(debtors.router)