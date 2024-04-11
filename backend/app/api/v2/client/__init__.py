from . import intent
from fastapi import APIRouter

router = APIRouter()

router.include_router(intent.router)
