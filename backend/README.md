
# Forum Backend API

This repository contains the backend API for the Forum application, implemented with both Django REST Framework and FastAPI.

## Project Structure

```
backend/
├── django_api/       # Django REST Framework implementation
│   ├── forum_api/    # Django project
│   ├── users/        # User authentication app
│   ├── discussions/  # Discussions & comments app
│   └── notifications/# Notifications app
│
├── fastapi_app/      # FastAPI implementation
│   ├── app/          # Main application
│   ├── routers/      # API routes
│   └── models/       # Database models
│
└── README.md         # This file
```

## Getting Started

### Prerequisites
- Python 3.9+
- PostgreSQL 13+
- pip

### Setup Instructions

#### Option 1: Django REST Framework

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd django_api
pip install -r requirements.txt
```

3. Set up environment variables:
Copy the `.env.example` file to `.env` and update the values.

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

#### Option 2: FastAPI

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd fastapi_app
pip install -r requirements.txt
```

3. Set up environment variables:
Copy the `.env.example` file to `.env` and update the values.

4. Run the development server:
```bash
uvicorn app.main:app --reload
```

## API Documentation

- Django REST Framework: http://localhost:8000/api/docs/
- FastAPI: http://localhost:8000/docs

## Authentication

Both APIs use JWT (JSON Web Tokens) for authentication. To authenticate:

1. Register a new user at `/api/auth/register/`
2. Login with credentials at `/api/auth/login/`
3. Use the returned token in the `Authorization` header as `Bearer <token>`
