import logging.config
from app.db import init_db
from app import app

# Initialize database
init_db()

if __name__ == '__main__':
    logging.config.fileConfig('logging.conf')

    # Define logger
    logger = logging.getLogger('app')

    # Start the FastAPI application server
    import uvicorn

    uvicorn.run(app, host='0.0.0.0', port=8000)
