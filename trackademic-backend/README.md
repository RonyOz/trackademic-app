# Trackademic Backend

RESTful API for the Trackademic application. This API handles all backend operations for the Trackademic platform.

## Setup and Installation

1. Clone the repository
2. Create and activate a virtual environment:
   ```
   python -m venv venv
   .\venv\Scripts\Activate.ps1  # Windows PowerShell
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Create a `.env` file with the necessary environment variables (see `.env.example` if available)

## Running the Application

To run the application in development mode:

```
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

## API Documentation

Once the application is running, you can access:
- Swagger UI documentation: http://localhost:8000/api/v1/docs
- ReDoc documentation: http://localhost:8000/api/v1/redoc
- OpenAPI JSON: http://localhost:8000/api/v1/openapi.json

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
