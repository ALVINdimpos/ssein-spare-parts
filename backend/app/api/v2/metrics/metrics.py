import datetime
from app.api.v2 import Res, FileScope
from fastapi import Depends, APIRouter, status
from app.db import get_db
from app.db.models import Product, User, File
from sqlalchemy.orm import Session
from sqlalchemy import func, and_

router = APIRouter()


def make_data(profit):
    return {
        "date": profit.date,
        "amount": profit.amount
    }


@router.get("/profit-loss-graph", response_model=Res)
async def get_profit_loss_graph(db: Session = Depends(get_db)):
    date_format = "YYYY-MM"
    profit_graph = (db.query(
        (func.to_char(Product.sold_date, date_format)).label("date"),
        (func.sum(
            (
                    Product.selling_price
                    - Product.purchase_price
                    - Product.tax
                    - Product.other_expenses
                    - Product.discount
            ))).label("amount")
    ).group_by(
        func.to_char(Product.sold_date, date_format),
    ).filter(
        and_(
            (
                    Product.selling_price
                    - Product.purchase_price
                    - Product.tax
                    - Product.other_expenses
                    - Product.discount
            ) >= 0,
            Product.is_sold == True
        )
    ).all())

    loss_graph = (db.query(
        (func.to_char(Product.sold_date, date_format)).label("date"),
        (func.sum(
            (
                    Product.selling_price
                    - Product.purchase_price
                    - Product.tax
                    - Product.other_expenses
                    - Product.discount
            ))).label("amount")
    ).group_by(
        func.to_char(Product.sold_date, date_format),
    ).filter(
        and_(
            (
                    Product.selling_price
                    - Product.purchase_price
                    - Product.tax
                    - Product.other_expenses
                    - Product.discount
            ) < 0,
            Product.is_sold == True
        )
    ).all())

    res = Res(
        status=status.HTTP_200_OK,
        message="Profit-Loss graph data retrieved successfully!",
        data={
            "profit_graph": [make_data(profit) for profit in profit_graph],
            "loss_graph": [make_data(loss) for loss in loss_graph]
        }
    )
    return res


@router.get("/", response_model=Res)
async def get_metrics(db: Session = Depends(get_db)) -> Res:
    stock = db.query(
        func.sum(Product.selling_price).label('instock')
    ).filter(Product.is_sold == False).first()

    profit = db.query(
        func.sum(
            (
                    Product.selling_price
                    - Product.purchase_price
                    - Product.tax
                    - Product.other_expenses
                    - Product.discount
            )
        ).label('profit')
    ).filter(and_(
        (
                Product.selling_price
                - Product.purchase_price
                - Product.tax
                - Product.other_expenses
                - Product.discount
        ) >= 0,
        Product.is_sold == True
    )).first()

    loss = db.query(
        func.sum(
            (
                    Product.selling_price
                    - Product.purchase_price
                    - Product.tax
                    - Product.other_expenses
                    - Product.discount
            )
        ).label('loss')
    ).filter(and_(
        (
                Product.selling_price
                - Product.purchase_price
                - Product.tax
                - Product.other_expenses
                - Product.discount
        ) < 0,
        Product.is_sold == True
    )).first()

    users = db.query(
        func.count(User.id).label('users')
    ).first()

    sold = db.query(
        func.sum(
            Product.selling_price - Product.discount
        ).label('sold')
    ).filter(
        and_(
            Product.is_sold == True
        )
    ).first()

    sold_today = db.query(
        func.sum(
            Product.selling_price - Product.discount
        ).label('sold_today')
    ).filter(
        and_(
            Product.is_sold == True,
            func.DATE(Product.sold_date) == datetime.date.today()
        )
    ).first()

    tax_docs = db.query(
        func.count(File.id).label('tax_docs')
    ).filter(
        and_(
            File.scope == FileScope.TAX.value
        )
    ).first()

    res = Res(
        status=status.HTTP_200_OK,
        message="Metrics data retrieved successfully!",
        data={
            "stock": stock.instock,
            "users": users.users,
            "sold_today": sold_today.sold_today,
            "sold": sold.sold,
            "tax_docs": tax_docs.tax_docs,
            "loss": loss.loss,
            "profit": profit.profit
        }
    )

    return res
