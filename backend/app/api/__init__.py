from fastapi import APIRouter, Depends
from app.api.v2.middlewares import get_current_user
from .endpoints import cars, categories, parts
from .v2 import user, file, product, metrics


api_router = APIRouter()
api_router.include_router(cars.router, prefix="/cars", tags=["Cars"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(parts.router, prefix="/parts", tags=["Parts"])
api_router.include_router(user.router, prefix="/users", tags=["Users"])
api_router.include_router(file.router, prefix="/files", tags=["Files"], dependencies=[Depends(get_current_user)])
api_router.include_router(product.router, prefix="/products", tags=["Products"])
api_router.include_router(metrics.router, prefix="/metrics", tags=["Metrics"], dependencies=[Depends(get_current_user)])
