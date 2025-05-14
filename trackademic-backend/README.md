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
├── app/               # Application package
│   ├── api/           # API endpoints
│   │   └── v1/        # API version 1
│   ├── core/          # Core application functionality
│   └── models/        # Data models and database schema
├── main.py            # Application entry point
├── config.py          # Configuration settings
└── requirements.txt   # Project dependencies
```
