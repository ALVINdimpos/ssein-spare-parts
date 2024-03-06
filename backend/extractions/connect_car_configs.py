from app.db import Session
from app.db.models import TrimEngineAndCar, TrimCar, Car

session = Session()

car = session.query(Car).filter_by(id=1).first()
fitments = car.fitments
print(len(fitments))
# i = 0
# for fitment in fitments:
#     # print(f"{i}-th fitment")
#     # trim_car = session.query(TrimCar).filter_by(id=fitment.trim_car_id).first()
#     # if trim_car:
#     #     car = session.query(Car).filter_by(id=trim_car.car_id).first()
#     #     if car:
#     #         fitment.cars.append(car)
#     #         session.commit()
#     # i += 1
#     cars = fit

session.close()
