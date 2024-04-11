import os
from dotenv import load_dotenv
from app.api.v2 import CarDocument
from sqlalchemy.orm import Session
from jinja2 import Template
from fastapi import Depends, APIRouter, Path, HTTPException, status
from fastapi.responses import StreamingResponse
from app.db.models import CarProduct
from app.db import get_db
from app.api.v2.product.product_codes import latex_to_pdf
from io import BytesIO
import qrcode

load_dotenv()

router = APIRouter()

not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Car product not found!"
)


def render_pdf(product):
    with open('./app/api/v2/car_product/car_product_template.tex', 'r') as template_file:
        template = Template(template_file.read())

    rendered_tex = template.render(product=product)

    # Compile LaTeX to PDF using pdflatex and capture the output
    pdf_content = latex_to_pdf(rendered_tex)
    pdf_stream = BytesIO(pdf_content)
    pdf_stream.seek(0)

    return pdf_stream


@router.get("/document/{product_id}")
async def get_product_document(
        product_id: int = Path(title="Product ID", description="The id of the product to documented"),
        db: Session = Depends(get_db)):
    product = db.query(CarProduct).filter_by(id=product_id).first()
    if not product:
        raise not_found
    product_document = CarDocument(
        vinnumber=product.vinnumber,
        description=product.description,
        make=product.make,
        model=product.model,
        year=product.year,
        engine=product.engine
    )

    document = render_pdf(product_document.dict())

    return StreamingResponse(document, media_type="application/pdf")


@router.get("/qrcode/{product_id}")
async def get_product_qrcode(
        product_id: int = Path(title="Product ID", description="The id of the product for qrcode")):
    link = f"{os.getenv('SERVER')}/products/document/{product_id}"
    img = qrcode.make(link)
    byte_stream = BytesIO()
    img.save(byte_stream)
    byte_stream.seek(0)
    return StreamingResponse(byte_stream, media_type="image/png")
