from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import api_router

origins = [
    "http://localhost",
    "http://localhost:8080",
    "*"
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "PATCH", "PUT"],
    allow_headers=["*"],
)
app.include_router(api_router)
