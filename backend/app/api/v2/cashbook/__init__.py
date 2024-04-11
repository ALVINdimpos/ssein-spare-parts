from . import add, get
from fastapi import APIRouter

router = APIRouter()

router.include_router(add.router)
router.include_router(get.router)