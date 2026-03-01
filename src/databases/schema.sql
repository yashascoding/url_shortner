-- USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- URLs TABLE
CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    original_url TEXT NOT NULL,
    short_code VARCHAR(20) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    click_count INTEGER DEFAULT 0,
    expiry_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast short code lookup
CREATE INDEX idx_short_code ON urls(short_code);

-- Index for user_id (fetch user URLs fast)
CREATE INDEX idx_user_id ON urls(user_id);

-- Index for expiry check
CREATE INDEX idx_expiry_date ON urls(expiry_date);