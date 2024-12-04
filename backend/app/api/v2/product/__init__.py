from . import update, add, get, delete, product_codes
from fastapi import APIRouter

router = APIRouter()


router.include_router(update.router)
router.include_router(delete.router)
router.include_router(get.router)
router.include_router(add.router)
router.include_router(product_codes.router)
