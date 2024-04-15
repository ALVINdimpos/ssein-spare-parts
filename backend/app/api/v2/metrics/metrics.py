import datetime
from app.api.v2 import Res, FileScope, make_cashbook, WhereTo
from fastapi import Depends, APIRouter, status, HTTPException
from app.db import get_db
from app.api.v2.middlewares.authentication import get_internal_user
from app.db.models import Product, User, File, CashBook, DebtManagement, CarProduct
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import Annotated

router = APIRouter()


def make_data(profit):
    return {
        "date": profit.date,
        "amount": profit.amount
    }


def add_metrics(m1, m2):
    metrics_sum = 0
    if m1:
        metrics_sum += float(m1)
    if m2:
        metrics_sum += float(m2)
    return metrics_sum


@router.get("/profit-loss-graph", response_model=Res, dependencies=[Depends(get_internal_user)])
async def get_profit_loss_graph_products(db: Session = Depends(get_db)):
    date_format = "YYYY-MM"
    profit_graph_product = (db.query(
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

    profit_graph_car = (db.query(
        (func.to_char(CarProduct.sold_date, date_format)).label("date"),
        (func.sum(
            (
                    CarProduct.selling_price
                    - CarProduct.purchase_price
                    - CarProduct.tax
                    - CarProduct.other_expenses
                    - CarProduct.transport_fees
                    - CarProduct.discount
        ))).label("amount")
    ).group_by(
        func.to_char(CarProduct.sold_date, date_format),
    ).filter(
        and_(
            (
                    CarProduct.selling_price
                    - CarProduct.purchase_price
                    - CarProduct.tax
                    - CarProduct.other_expenses
                    - CarProduct.transport_fees
                    - CarProduct.discount
            ) >= 0,
            CarProduct.is_sold == True
        )
    ).all())

    loss_graph_product = (db.query(
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

    loss_graph_car = (db.query(
        (func.to_char(CarProduct.sold_date, date_format)).label("date"),
        (func.sum(
            (
            CarProduct.selling_price
            - CarProduct.purchase_price
            - CarProduct.tax
            - CarProduct.other_expenses
            - CarProduct.transport_fees
            - CarProduct.discount
        ))).label("amount")
    ).group_by(
        func.to_char(CarProduct.sold_date, date_format),
    ).filter(
        and_(
            (
                    CarProduct.selling_price
                    - CarProduct.purchase_price
                    - CarProduct.tax
                    - CarProduct.other_expenses
                    - CarProduct.transport_fees
                    - CarProduct.discount
            ) < 0,
            CarProduct.is_sold == True
        )
    ).all())

    res = Res(
        status=status.HTTP_200_OK,
        message="Profit-Loss graph data retrieved successfully!",
        data={
            "profit_graph_product": [make_data(profit) for profit in profit_graph_product],
            "loss_graph_product": [make_data(loss) for loss in loss_graph_product],
            "profit_graph_car": [make_data(profit) for profit in profit_graph_car],
            "loss_graph_car": [make_data(loss) for loss in loss_graph_car]
        }
    )
    return res


@router.get("/", response_model=Res)
async def get_metrics(user: Annotated[User, Depends(get_internal_user)],
                      db: Session = Depends(get_db)) -> Res:
    stock_products = db.query(
        func.sum(Product.selling_price).label('instock')
    ).filter(Product.is_sold == False).first()

    stock_car = db.query(
        func.sum(CarProduct.selling_price).label('instock')
    ).filter(CarProduct.is_sold == False).first()

    stock = add_metrics(stock_car.instock, stock_products.instock)

    profit_product = db.query(
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

    profit_car = db.query(
        func.sum(
            (
                    CarProduct.selling_price
                    - CarProduct.purchase_price
                    - CarProduct.tax
                    - CarProduct.other_expenses
                    - CarProduct.transport_fees
                    - CarProduct.discount
            )
        ).label('profit')
    ).filter(and_(
        (
                CarProduct.selling_price
                - CarProduct.purchase_price
                - CarProduct.tax
                - CarProduct.other_expenses
                - CarProduct.transport_fees
                - CarProduct.discount
        ) >= 0,
        CarProduct.is_sold == True
    )).first()

    profit = add_metrics(profit_product.profit, profit_car.profit)

    loss_product = db.query(
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

    loss_car = db.query(
        func.sum(
            (
                    CarProduct.selling_price
                    - CarProduct.purchase_price
                    - CarProduct.tax
                    - CarProduct.other_expenses
                    - CarProduct.transport_fees
                    - CarProduct.discount
            )
        ).label('loss')
    ).filter(and_(
        (
                CarProduct.selling_price
                - CarProduct.purchase_price
                - CarProduct.tax
                - CarProduct.other_expenses
                - CarProduct.transport_fees
                - CarProduct.discount
        ) < 0,
        CarProduct.is_sold == True
    )).first()

    loss = add_metrics(loss_product.loss, loss_car.loss)

    users = db.query(
        func.count(User.id).label('users')
    ).first()

    sold_product = db.query(
        func.sum(
            Product.selling_price - Product.discount
        ).label('sold')
    ).filter(
        and_(
            Product.is_sold == True
        )
    ).first()

    sold_car = db.query(
        func.sum(
            CarProduct.selling_price
        ).label('sold')
    ).filter(
        and_(
            CarProduct.is_sold == True
        )
    ).first()

    sold = add_metrics(sold_car.sold, sold_product.sold)

    sold_today_product = db.query(
        func.sum(
            Product.selling_price - Product.discount
        ).label('sold_today')
    ).filter(
        and_(
            Product.is_sold == True,
            func.DATE(Product.sold_date) == datetime.date.today()
        )
    ).first()

    sold_today_car = db.query(
        func.sum(
            CarProduct.selling_price
        ).label('sold_today')
    ).filter(
        and_(
            CarProduct.is_sold == True,
            func.DATE(CarProduct.sold_date) == datetime.date.today()
        )
    ).first()

    sold_today = add_metrics(sold_today_car.sold_today, sold_today_product.sold_today)

    tax_docs = db.query(
        func.count(File.id).label('tax_docs')
    ).filter(
        and_(
            File.scope == FileScope.TAX.value
        )
    ).first()

    cash = db.query(
        func.sum(
            CashBook.amount
        ).label('total_cash')
    ).filter_by(where_to=WhereTo.CASH.value).first()
    bank = db.query(
        func.sum(
            CashBook.amount
        ).label('total_bank')
    ).filter_by(where_to=WhereTo.BANK.value).first()
    debit_today = db.query(
        func.sum(
            DebtManagement.amount
        ).label('debit_today')
    ).filter(
        and_(
            func.DATE(DebtManagement.created_at) == datetime.date.today(),
            DebtManagement.status == 'good'
        )
    ).first()
    cash_today = db.query(
        func.sum(
            CashBook.amount
        ).label('cash_today')
    ).filter(
        func.DATE(CashBook.created_at) == datetime.date.today()
    ).filter_by(where_to=WhereTo.CASH.value).first()

    bank_today = db.query(
        func.sum(
            CashBook.amount
        ).label('bank_today')
    ).filter(
        func.DATE(CashBook.created_at) == datetime.date.today()
    ).filter_by(where_to=WhereTo.BANK.value).first()

    res = Res(
        status=status.HTTP_200_OK,
        message="Metrics data retrieved successfully!",
        data={
            "stock": stock,
            "users": users.users,
            "sold_today": sold_today,
            "sold": sold,
            "tax_docs": tax_docs.tax_docs,
            "loss": loss,
            "profit": profit,
            "cash_book": {
                "cash_today": cash_today.cash_today,
                "bank_today": bank_today.bank_today,
                "total_cash": cash.total_cash if user.role in ['admin', 'superadmin'] else None,
                "total_bank": bank.total_bank if user.role in ['admin', 'superadmin'] else None
            },
            "debit_today": debit_today.debit_today,
        }
    )

    return res
