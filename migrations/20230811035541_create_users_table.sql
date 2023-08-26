-- Add migration script here
CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    name varchar(255) NOT NULL,
    role varchar(255) NOT NULL,
    username varchar(50) NOT NULL,
    password varchar(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);