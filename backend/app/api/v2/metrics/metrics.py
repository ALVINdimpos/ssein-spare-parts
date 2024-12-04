import datetime
from app.api.v2 import Res, FileScope, WhereTo
from fastapi import Depends, APIRouter, status
from app.db import get_db
from app.api.v2.middlewares.authentication import get_internal_user
from app.db.models import Product, User, File, CashBook, DebtManagement, CarProduct, Battery, Cell
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import Annotated
from collections import defaultdict


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

def normalize_and_combine_graph_data(*query_results):
    """
    Normalizes and combines multiple query results into a single dataset for graphing.

    Args:
        query_results: A list of query results, where each result is a list of rows
                       with "date" and "amount".

    Returns:
        A sorted list of dictionaries with "date" and aggregated "amount".
    """
    combined_results = []

    # Flatten and normalize results from all queries
    for result in query_results:
        for row in result:
            combined_results.append({"date": row.date, "amount": float(row.amount)})

    # Aggregate amounts by date
    merged_data = defaultdict(float)
    for entry in combined_results:
        merged_data[entry["date"]] += entry["amount"]

    # Convert aggregated data to a list and sort by date
    graph_data = [{"date": date, "amount": amount} for date, amount in merged_data.items()]
    return sorted(graph_data, key=lambda x: x["date"])


def normalize_and_combine_stock_metrics(*query_results):
    """
    Normalizes and combines stock metrics from multiple query results.

    Args:
        query_results: A list of query results, where each result contains
                       a single row with a stock metric.

    Returns:
        A dictionary with the total combined stock metric.
    """
    total_instock = 0

    # Sum the 'instock' values from all queries
    for result in query_results:
        if result and result.instock:
            total_instock += float(result.instock)

    return total_instock


def normalize_and_combine_metrics(*query_results, metric_key='profit'):
    """
    Normalizes and combines profit or loss metrics from multiple query results.

    Args:
        query_results: A list of query results, where each result contains
                       a single row with a 'profit' or 'loss' metric.

    Returns:
        A dictionary with the total combined profit or loss metric.
    """
    total_value = 0

    # Sum the 'profit' or 'loss' values from all queries
    for result in query_results:
        if result and getattr(result, metric_key, None):
            total_value += float(getattr(result, metric_key))

    return total_value


@router.get("/profit-loss-graph", response_model=Res, dependencies=[Depends(get_internal_user)])
async def get_profit_loss_graph_products(db: Session = Depends(get_db)):
    date_format = "YYYY-MM"

    # Profit from Products
    profit_graph_product = db.query(
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
    ).all()

    # Profit from Batteries
    profit_graph_battery = db.query(
        func.to_char(Battery.sold_date, date_format).label("date"),
        func.sum(
            Battery.selling_price
            - Battery.purchase_price
            - Battery.tax
            - Battery.other_expenses
            - Battery.discount
        ).label("amount")
    ).group_by(
        func.to_char(Battery.sold_date, date_format)
    ).filter(
        and_(
            (
                    Battery.selling_price
                    - Battery.purchase_price
                    - Battery.tax
                    - Battery.other_expenses
                    - Battery.discount
            ) >= 0,
            Battery.is_sold == True
        )
    ).all()

    # Profit from Cells
    profit_graph_cell = db.query(
        func.to_char(Cell.sold_date, date_format).label("date"),
        func.sum(
            Cell.selling_price
            - Cell.purchase_price
            - Cell.tax
            - Cell.other_expenses
            - Cell.discount
        ).label("amount")
    ).group_by(
        func.to_char(Cell.sold_date, date_format)
    ).filter(
        and_(
            (
                    Cell.selling_price
                    - Cell.purchase_price
                    - Cell.tax
                    - Cell.other_expenses
                    - Cell.discount
            ) >= 0,
            Cell.is_sold == True
        )
    ).all()

    profit_graph_combined = normalize_and_combine_graph_data(profit_graph_product, profit_graph_battery,
                                                             profit_graph_cell)

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

    # Loss from Products
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

    # Loss from Batteries
    loss_graph_battery = db.query(
        func.to_char(Battery.sold_date, date_format).label("date"),
        func.sum(
            Battery.selling_price
            - Battery.purchase_price
            - Battery.tax
            - Battery.other_expenses
            - Battery.discount
        ).label("amount")
    ).group_by(
        func.to_char(Battery.sold_date, date_format)
    ).filter(
        and_(
            (
                    Battery.selling_price
                    - Battery.purchase_price
                    - Battery.tax
                    - Battery.other_expenses
                    - Battery.discount
            ) < 0,
            Battery.is_sold == True
        )
    ).all()

    # Loss from Cells
    loss_graph_cell = db.query(
        func.to_char(Cell.sold_date, date_format).label("date"),
        func.sum(
            Cell.selling_price
            - Cell.purchase_price
            - Cell.tax
            - Cell.other_expenses
            - Cell.discount
        ).label("amount")
    ).group_by(
        func.to_char(Cell.sold_date, date_format)
    ).filter(
        and_(
            (
                    Cell.selling_price
                    - Cell.purchase_price
                    - Cell.tax
                    - Cell.other_expenses
                    - Cell.discount
            ) < 0,
            Cell.is_sold == True
        )
    ).all()

    loss_graph_combined = normalize_and_combine_graph_data(loss_graph_product, loss_graph_battery, loss_graph_cell)

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
            "profit_graph_product": profit_graph_combined,
            "loss_graph_product": loss_graph_combined,
            "profit_graph_car": [make_data(profit) for profit in profit_graph_car],
            "loss_graph_car": [make_data(loss) for loss in loss_graph_car]
        }
    )
    return res


@router.get("/", response_model=Res)
async def get_metrics(user: Annotated[User, Depends(get_internal_user)],
                      db: Session = Depends(get_db)) -> Res:
    # Stock from Products
    stock_products = db.query(
        func.sum(Product.selling_price).label('instock')
    ).filter(
        Product.is_sold == False
    ).first()
    
    # Stock from Batteries
    stock_batteries = db.query(
        func.sum(Battery.selling_price).label('instock')
    ).filter(
        and_(
            Battery.is_sold == False,
            Battery.sold_fully == True,
        )
    ).first()

    # Stock from Cells
    stock_cells = db.query(
        func.sum(Cell.selling_price).label('instock')
    ).filter(
        Cell.is_sold == False
    ).first()


    stock_car = db.query(
        func.sum(CarProduct.selling_price).label('instock')
    ).filter(CarProduct.is_sold == False).first()

    stock = normalize_and_combine_stock_metrics(stock_products, stock_batteries, stock_cells, stock_car)

    # Profit from Products
    profit_product = db.query(
        func.sum(
            Product.selling_price
            - Product.purchase_price
            - Product.tax
            - Product.other_expenses
            - Product.discount
        ).label('profit')
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
    ).first()

    # Profit from Batteries
    profit_battery = db.query(
        func.sum(
            Battery.selling_price
            - Battery.purchase_price
            - Battery.tax
            - Battery.other_expenses
            - Battery.discount
        ).label('profit')
    ).filter(
        and_(
            (
                    Battery.selling_price
                    - Battery.purchase_price
                    - Battery.tax
                    - Battery.other_expenses
                    - Battery.discount
            ) >= 0,
            Battery.is_sold == True
        )
    ).first()

    # Profit from Cells
    profit_cell = db.query(
        func.sum(
            Cell.selling_price
            - Cell.purchase_price
            - Cell.tax
            - Cell.other_expenses
            - Cell.discount
        ).label('profit')
    ).filter(
        and_(
            (
                    Cell.selling_price
                    - Cell.purchase_price
                    - Cell.tax
                    - Cell.other_expenses
                    - Cell.discount
            ) >= 0,
            Cell.is_sold == True
        )
    ).first()

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

    profit = normalize_and_combine_metrics(profit_product, profit_battery, profit_cell, profit_car, metric_key='profit')

    # Loss from Products
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

    # Loss from Batteries
    loss_battery = db.query(
        func.sum(
            Battery.selling_price
            - Battery.purchase_price
            - Battery.tax
            - Battery.other_expenses
            - Battery.discount
        ).label('loss')
    ).filter(
        and_(
            (
                    Battery.selling_price
                    - Battery.purchase_price
                    - Battery.tax
                    - Battery.other_expenses
                    - Battery.discount
            ) < 0,
            Battery.is_sold == True
        )
    ).first()

    # Loss from Cells
    loss_cell = db.query(
        func.sum(
            Cell.selling_price
            - Cell.purchase_price
            - Cell.tax
            - Cell.other_expenses
            - Cell.discount
        ).label('loss')
    ).filter(
        and_(
            (
                    Cell.selling_price
                    - Cell.purchase_price
                    - Cell.tax
                    - Cell.other_expenses
                    - Cell.discount
            ) < 0,
            Cell.is_sold == True
        )
    ).first()

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

    loss = normalize_and_combine_metrics(loss_product, loss_battery, loss_cell, loss_car, metric_key='loss')

    users = db.query(
        func.count(User.id).label('users')
    ).first()

    # Sold Products
    sold_product = db.query(
        func.sum(
            Product.selling_price - Product.discount
        ).label('sold')
    ).filter(
        Product.is_sold == True
    ).first()

    # Sold Batteries
    sold_battery = db.query(
        func.sum(
            Battery.selling_price - Battery.discount
        ).label('sold')
    ).filter(
        Battery.is_sold == True
    ).first()

    # Sold Cells
    sold_cell = db.query(
        func.sum(
            Cell.selling_price - Cell.discount
        ).label('sold')
    ).filter(
        Cell.is_sold == True
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

    sold = normalize_and_combine_metrics(sold_product, sold_battery, sold_cell, sold_car, metric_key='sold')

    # Sold Today - Products
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

    # Sold Today - Batteries
    sold_today_battery = db.query(
        func.sum(
            Battery.selling_price - Battery.discount
        ).label('sold_today')
    ).filter(
        and_(
            Battery.is_sold == True,
            func.DATE(Battery.sold_date) == datetime.date.today()
        )
    ).first()

    # Sold Today - Cells
    sold_today_cell = db.query(
        func.sum(
            Cell.selling_price - Cell.discount
        ).label('sold_today')
    ).filter(
        and_(
            Cell.is_sold == True,
            func.DATE(Cell.sold_date) == datetime.date.today()
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

    sold_today = normalize_and_combine_metrics(
        sold_today_product,
        sold_today_battery,
        sold_today_cell,
        sold_today_car,
        metric_key='sold_today'
    )

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
