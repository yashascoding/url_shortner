# URL Shortener API

A RESTful URL shortening service built with **Node.js**, **Express**, and **PostgreSQL** — developed as part of a Cisco internship project.

## Features

- User authentication (register/login) with JWT
- Shorten long URLs with optional expiry
- Redirect via short code with click tracking
- List and delete your URLs
- PostgreSQL with indexes for fast lookups

## Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Runtime    | Node.js                            |
| Framework  | Express 5                          |
| Database   | PostgreSQL                         |
| Auth       | JWT (jsonwebtoken) + bcrypt        |
| Driver     | pg (node-postgres)                 |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/urlshortner_backend.git
cd urlshortner_backend

# Install dependencies
npm install

# Create the database
psql -U postgres -c "CREATE DATABASE url_shortner;"

# Run the schema
psql -U postgres -d url_shortner -f src/databases/schema.sql

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials and a JWT secret
```

### Environment Variables

| Variable      | Description                | Default        |
|---------------|----------------------------|----------------|
| `DB_HOST`     | PostgreSQL host            | `localhost`    |
| `DB_PORT`     | PostgreSQL port            | `5432`         |
| `DB_USER`     | PostgreSQL user            | `postgres`     |
| `DB_PASSWORD` | PostgreSQL password        |                |
| `DB_NAME`     | Database name              | `url_shortner` |
| `JWT_SECRET`  | Secret for signing tokens  |                |
| `PORT`        | API server port            | `3000`         |

### Run

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server starts at `http://localhost:3000`.

## API Endpoints

### Authentication

| Method | Endpoint         | Description          | Auth Required |
|--------|------------------|----------------------|---------------|
| POST   | `/auth/register` | Create a new account | No            |
| POST   | `/auth/login`    | Log in and get JWT   | No            |

#### `POST /auth/register`

```json
// Request
{ "email": "user@example.com", "password": "securepass123" }

// Response (201)
{
  "message": "User registered successfully",
  "user": { "id": 1, "email": "user@example.com" },
  "token": "eyJhbGci..."
}
```

#### `POST /auth/login`

```json
// Request
{ "email": "user@example.com", "password": "securepass123" }

// Response (200)
{
  "message": "Login successful",
  "user": { "id": 1, "email": "user@example.com" },
  "token": "eyJhbGci..."
}
```

### URLs

All URL endpoints (except redirect) require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <token>
```

| Method | Endpoint              | Description                     |
|--------|-----------------------|---------------------------------|
| POST   | `/url/shorten`        | Create a shortened URL          |
| GET    | `/url/myurls`         | List your URLs                  |
| DELETE | `/url/:id`            | Delete one of your URLs         |
| GET    | `/r/:short_code`      | Redirect to the original URL    |

> **Note:** The redirect route is configured at `/r/:short_code` in production setups. Adjust your routes accordingly.

#### `POST /url/shorten`

```json
// Request
{ "original_url": "https://example.com/very/long/url", "expiry_days": 7 }

// Response (201)
{
  "message": "URL created successfully",
  "url": {
    "id": 42,
    "original_url": "https://example.com/very/long/url",
    "short_code": "aB3xK9",
    "user_id": 1,
    "click_count": 0,
    "expiry_date": "2025-04-15T00:00:00.000Z",
    "created_at": "2025-04-08T12:00:00.000Z"
  }
}
```

`expiry_days` is optional — omit it for a permanent link.

#### `GET /url/myurls`

```json
// Response (200)
{
  "urls": [
    {
      "id": 42,
      "original_url": "https://example.com/very/long/url",
      "short_code": "aB3xK9",
      "click_count": 5,
      "expiry_date": null,
      "created_at": "2025-04-08T12:00:00.000Z"
    }
  ]
}
```

#### `DELETE /url/:id`

```json
// Response (200)
{ "message": "URL deleted successfully", "url": { ... } }

// Response (404)
{ "error": "URL not found" }
```

#### `GET /url/:short_code`

Redirects (302) the client to the original URL. If the link has expired, returns **410 Gone**.

## Database Schema

```sql
-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- URLs
CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    original_url TEXT NOT NULL,
    short_code VARCHAR(20) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    click_count INTEGER DEFAULT 0,
    expiry_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Indexes are created on `short_code`, `user_id`, and `expiry_date` for performance.

## ER Diagram

![ER Diagram](https://github.com/user-attachments/assets/26e2589b-8cf9-4b9a-82ac-56b0e466bea0)

## Project Structure

```
├── index.js                     # Express app entry point
├── src/
│   ├── config/db.js             # PostgreSQL connection pool
│   ├── controllers/
│   │   ├── AuthController.js    # Register / login handlers
│   │   └── UrlController.js     # CRUD + redirect handlers
│   ├── databases/schema.sql     # Database schema definition
│   ├── middlewares/
│   │   ├── auth.js              # JWT verification middleware
│   │   └── errorHandler.js      # Global error handler
│   ├── models/
│   │   ├── UserModel.js         # User database queries
│   │   └── UrlModel.js          # URL database queries
│   ├── routes/
│   │   ├── authRoutes.js        # Auth route definitions
│   │   └── urlRoutes.js         # URL route definitions
│   ├── services/                # (reserved for business logic)
│   └── utils/                   # (reserved for helpers)
├── .env                         # Environment variables (not tracked)
├── .gitignore
└── package.json
```
