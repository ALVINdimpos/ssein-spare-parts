from fastapi import APIRouter
from . import add, login, update, get
router = APIRouter()

router.include_router(add.router)
router.include_router(login.router)
router.include_router(update.router)
router.include_router(get.router)