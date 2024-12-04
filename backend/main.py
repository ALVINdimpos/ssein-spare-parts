# from app.db.models.dashboard import create_super_admin
import logging.config
from app import app
from dotenv import load_dotenv
import os

load_dotenv(override=True)


if __name__ == '__main__':
    logging.config.fileConfig('logging.conf')
    # Create Super Admin
    # create_super_admin()

    # Define logger
    logger = logging.getLogger('app')

    # Start the FastAPI application server
    import uvicorn

    uvicorn.run(app, host=os.getenv('HOST'), port=int(os.getenv('PORT', 8000)))
