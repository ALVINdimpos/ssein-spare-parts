from app.api.v2 import Res
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, HTTPException, status
from app.core.minio import minio_client
from typing import Annotated
from app.db import get_db
from app.db.models import File, User
from app.api.v2.middlewares import get_current_user
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

BUCKET_NAME = os.getenv("BUCKET_NAME")

file_not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="File not found"
)

unauthorized = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Unauthorized to perform this action"
)


async def delete_objects(files: list[str]):
    minio_client.remove_objects(
        bucket_name=BUCKET_NAME,
        object_names=files
    )


@router.delete("/delete", response_model=Res)
async def delete_file(
        user: Annotated[User, Depends(get_current_user)],
        path: str,
        db: Annotated[Session, Depends(get_db)]) -> Res:
    if 'admin' not in user.role:
        raise unauthorized
    file = db.query(File).filter_by(path=path).first()
    if not file:
        raise file_not_found
    await delete_objects([file.path])
    db.delete(file)
    db.commit()

    res = Res(
        status=status.HTTP_200_OK,
        message="Deleted file successfully!",
        data={
            "file": {
                "path": file.path,
                "name": file.name,
                "size": file.size,
                "etag": file.etag,
                "type": file.type,
                "scope": file.scope
            }
        }
    )

    return res
