from app.api.v2 import Res, FileModel
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, HTTPException, status
from app.core.minio import minio_client
from typing import Annotated
from app.db import get_db
from app.db.models import File
from fastapi.responses import StreamingResponse
from app.api.v2.middlewares import get_internal_user
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

BUCKET_NAME = os.getenv("BUCKET_NAME")

file_not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="File not found"
)


@router.get("/download", response_class=StreamingResponse)
async def download_file(path: str, db: Annotated[Session, Depends(get_db)]):
    file = db.query(File).filter_by(path=path).first()
    if not file:
        raise file_not_found
    stream = minio_client.get_object(
        bucket_name=BUCKET_NAME,
        object_name=path
    )

    return StreamingResponse(stream, media_type=file.type)


def make_file(file: File) -> FileModel:
    return FileModel(
        path=file.path,
        name=file.name,
        size=file.size,
        type=file.type,
        scope=file.scope,
        etag=file.etag
    )


@router.get("/", response_model=Res, dependencies=[Depends(get_internal_user)])
async def get_files(db: Annotated[Session, Depends(get_db)]) -> Res:
    files = db.query(File).group_by('scope', 'id').all()

    res = Res(
        status=status.HTTP_200_OK,
        message="Files retrieved successfully!",
        data={
            "files": [make_file(file).dict() for file in files]
        }
    )
    return res
