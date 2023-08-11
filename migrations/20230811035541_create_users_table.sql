-- Add migration script here
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name varchar(255),
    role varchar(255),
    username varchar(50),
    password varchar(255),
    created_at TIMESTAMP DEFAULT NOW()
);