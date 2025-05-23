from . import add, get, update
from fastapi import APIRouter, Depends

router = APIRouter()

router.include_router(add.router)
router.include_router(get.router)
router.include_router(update.router)
