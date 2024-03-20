from app.api.v2 import Res, FileScope, FileModel
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, HTTPException, status, UploadFile
from app.core.minio import minio_client
from typing import Annotated
from app.db import get_db
from app.db.models import File
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

BUCKET_NAME = os.getenv('BUCKET_NAME')

no_files_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="No files provided"
)

file_already_exists_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Path already exists"
)


async def create_file(file: UploadFile,
                      etag: str,
                      path: str,
                      db: Annotated[Session, Depends(get_db)],
                      scope: FileScope = FileScope.OTHER):
    _file = FileModel(
        name=file.filename,
        type=file.content_type,
        size=file.size,
        etag=etag,
        path=path,
        scope=scope.value
    )
    new_file = File(**_file.dict())
    db.add(new_file)
    db.commit()
    return _file.dict()


@router.post("/", response_model=Res)
async def upload_files(files: list[UploadFile],
                       db: Annotated[Session, Depends(get_db)],
                       scope: FileScope = FileScope.OTHER):
    if not len(files):
        raise no_files_exception

    file_list = []
    for file in files:
        path = f"documents/{scope.value}/{file.filename}"
        check_dup = db.query(File).filter_by(path=path).first()
        if check_dup:
            raise file_already_exists_exception
        result = minio_client.put_object(
            bucket_name=BUCKET_NAME,
            object_name=path,
            data=file.file,
            content_type=file.content_type,
            length=file.size
        )
        file_list.append(await create_file(
            file=file,
            etag=result.etag,
            path=path,
            scope=scope,
            db=db))

    res = Res(
        status=status.HTTP_200_OK,
        message="Files uploaded successfully",
        data={
            "files": file_list
        }
    )
    return res
