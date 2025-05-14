# Trackademic Backend

RESTful API for the Trackademic application. This API handles all backend operations for the Trackademic platform.

## Setup and Installation

1. Create and activate a virtual environment:
   ```
   python -m venv venv
   .\venv\Scripts\Activate.ps1  # Windows PowerShell
   ```
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Create a `.env` file with the necessary environment variables - PENDING
   
## Running the Application

To run the application in development mode:

```
uvicorn src.main:app --reload
```

The API will be available at [http://localhost:8000]

## API Documentation

Once the application is running, you can access documentation: [http://localhost:8000/docs]

## Project Structure

```
/
├── requirements.txt  # Contains the list of dependencies for the project
└── src
    ├── __init__.py   # Marks the directory as a Python package
    ├── routers       # Contains the FastAPI route handlers
    ├── services      # Contains business logic and helper functions
    ├── models        # Defines database models (e.g., ORM classes)
    ├── db            # Contains the database connection
    └── main.py       # Main entry point of the FastAPI application

```
