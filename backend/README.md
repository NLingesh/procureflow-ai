# ProcureFlow AI — Backend

> AI-powered procurement platform backend built with **FastAPI**, **SQLAlchemy 2.x**, and **Pydantic v2**.

---

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.py              # Authentication endpoints (placeholder)
│   │   │   ├── vendors.py           # Vendor management (placeholder)
│   │   │   ├── purchase_orders.py   # Purchase orders (placeholder)
│   │   │   ├── invoices.py          # Invoice processing (placeholder)
│   │   │   ├── dashboard.py         # Dashboard data (placeholder)
│   │   │   └── analytics.py         # AI analytics (placeholder)
│   │   └── api.py                   # Central API router
│   ├── core/
│   │   ├── config.py                # Application configuration
│   │   ├── database.py              # SQLAlchemy engine & session
│   │   ├── security.py              # Password hashing & JWT helpers
│   │   └── auth.py                  # Auth dependencies
│   ├── models/
│   │   ├── __init__.py              # Model registry
│   │   ├── user.py                  # User model
│   │   ├── vendor.py                # Vendor model
│   │   ├── purchase_order.py        # Purchase order model
│   │   └── invoice.py               # Invoice model
│   ├── schemas/                     # Pydantic request/response schemas
│   ├── services/                    # Business logic layer
│   ├── utils/                       # Shared utilities
│   └── main.py                      # FastAPI application factory
├── requirements.txt
├── .env.example
├── .env
├── run.py                           # Uvicorn entry point
└── README.md
```

---

## 🚀 Quick Start

### 1. Create & activate virtual environment

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Linux / macOS
# venv\Scripts\activate         # Windows
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your settings (defaults work for development)
```

### 4. Run the server

```bash
python run.py
```

The server starts at **http://localhost:8000**.

---

## 📖 API Documentation

| Interface | URL                          |
|-----------|------------------------------|
| Swagger   | http://localhost:8000/docs    |
| ReDoc     | http://localhost:8000/redoc   |
| OpenAPI   | http://localhost:8000/openapi.json |

---

## ✅ Available Endpoints

| Method | Path      | Description                    |
|--------|-----------|--------------------------------|
| GET    | `/`       | Root — confirms API is running |
| GET    | `/health` | Health check for monitoring    |

---

## ⚙️ Configuration

All configuration is managed via environment variables (`.env` file):

| Variable                     | Default                       | Description                        |
|------------------------------|-------------------------------|------------------------------------|
| `APP_NAME`                   | ProcureFlow AI                | Application display name           |
| `APP_VERSION`                | 1.0.0                         | Application version                |
| `ENVIRONMENT`                | development                   | Runtime environment                |
| `DATABASE_URL`               | sqlite:///./procureflow.db    | Database connection string         |
| `SECRET_KEY`                 | *(change in production)*      | JWT signing secret                 |
| `ACCESS_TOKEN_EXPIRE_MINUTES`| 30                            | JWT token lifetime (minutes)       |
| `ALGORITHM`                  | HS256                         | JWT signing algorithm              |
| `BACKEND_CORS_ORIGINS`       | http://localhost:5173,...      | Allowed CORS origins (comma-sep)   |

---

## 🛠️ Tech Stack

- **Python 3.12**
- **FastAPI** — High-performance async web framework
- **SQLAlchemy 2.x** — ORM with async-ready architecture
- **Pydantic v2** — Data validation and serialization
- **SQLite** — Development database
- **Uvicorn** — ASGI server
- **Passlib + bcrypt** — Password hashing
- **python-jose** — JWT token management
- **Alembic** — Database migrations (ready)

---

## 📝 License

This project is proprietary. All rights reserved.
