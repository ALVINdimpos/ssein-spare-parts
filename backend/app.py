from database import Base, engine, Session
from database.models import Category, Subcategory

# Create tables in the database
Base.metadata.create_all(bind=engine)

# Create a session to interact with the database
session = Session()

# Example usage:
# Create a category
# new_cat = {
#     "name": "Air Conditioner"
# }
# new_cat = Category(**new_cat)
# session.add(new_cat)
# session.commit()
#
# # Create a post for the user
# new_sub = {
#     "name": "Propellers",
#     "category": new_cat
# }
#
# new_sub = Subcategory(**new_sub)
# session.add(new_sub)
# session.commit()
#
# # Query the posts written by a user
# category = session.query(Category).filter_by(name='Air Conditioner').first()
#
# for subcat in category.subcategories:
#     print(subcat.name)

# Close the session when done
session.close()
