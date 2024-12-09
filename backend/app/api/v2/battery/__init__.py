from . import add, get, update, delete
from fastapi import APIRouter, Depends

router = APIRouter()

router.include_router(add.router)
router.include_router(get.router)
router.include_router(update.router)
router.include_router(delete.router)
