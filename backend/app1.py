from database import Base, engine, Session
from database.models import Part, Accessory
from sqlalchemy import Index

# Create tables in the database
Base.metadata.create_all(bind=engine)

# Create a session to interact with the database
session = Session()

# indices = [
#     Index('idx_part_num', Part.part_num),
#     Index('idx_part_name', Part.name),
#     Index('idx_part_other_names', Part.other_names),
#     Index('idx_description', Part.description),
#     Index('idx_replaces', Part.replaces),
#     Index('idx_accessory_num', Accessory.part_num),
#     Index('idx_accessory_name', Accessory.name),
#     Index('idx_accessory_other_names', Accessory.other_names),
#     Index('idx_accessory_description', Accessory.description),
#     Index('idx_accessory_replaces', Accessory.replaces)
# ]
#
# for index in indices:
#     index.create(engine)
#
# session.commit()

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
