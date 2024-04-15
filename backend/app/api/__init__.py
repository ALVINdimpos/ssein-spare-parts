from fastapi import APIRouter, Depends
from app.api.v2.middlewares import get_current_user, get_internal_user
from .endpoints import cars, categories, parts
from .v2 import user, file, product, metrics, debtmanagement, inquiry, car_product, cashbook, client


api_router = APIRouter()
api_router.include_router(cars.router, prefix="/cars", tags=["Cars"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(parts.router, prefix="/parts", tags=["Parts"])
api_router.include_router(user.router, prefix="/users", tags=["Users"])
api_router.include_router(file.router, prefix="/files", tags=["Files"])
api_router.include_router(product.router, prefix="/products", tags=["Products"])
api_router.include_router(metrics.router, prefix="/metrics",
                          tags=["Metrics"], dependencies=[Depends(get_internal_user)])
api_router.include_router(debtmanagement.router, prefix="/management",
                          tags=["Debt Management"], dependencies=[Depends(get_internal_user)])
api_router.include_router(inquiry.router, prefix='/inquiry', tags=['Inquiries'])
api_router.include_router(car_product.router, prefix='/car-product', tags=['Car Products'])
api_router.include_router(cashbook.router, prefix='/cashbook',
                          tags=['Cashbook'], dependencies=[Depends(get_internal_user)])
api_router.include_router(client.router, prefix='/client', tags=['Clients'])
