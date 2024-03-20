from dotenv import load_dotenv
from minio import Minio
import os

load_dotenv()

minio_client = Minio(
    access_key=os.getenv("MINIO_ACCESS_KEY"),
    secret_key=os.getenv("MINIO_SECRET_KEY"),
    endpoint=os.getenv("MINIO_ENDPOINT"),
    cert_check=False,
    secure=False
)
