from fastapi import APIRouter
from . import delete, update, get, add

router = APIRouter()
router.include_router(add.router)
router.include_router(update.router)
router.include_router(get.router)
router.include_router(delete.router)
