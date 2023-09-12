CREATE TYPE chat_role AS ENUM('USER', 'AI');

-- Add migration script here
CREATE TABLE user_model_messages (
    id SERIAL PRIMARY KEY,
    user_model_id integer REFERENCES user_models (id),
    message text,
    who chat_role NOT NULL
);