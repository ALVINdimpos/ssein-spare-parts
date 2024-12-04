from fastapi import APIRouter
from . import delete, get, upload
router = APIRouter()

router.include_router(upload.router)
router.include_router(get.router)
router.include_router(delete.router)
