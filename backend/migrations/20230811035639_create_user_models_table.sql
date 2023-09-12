-- Add migration script here
CREATE TABLE user_models (
    id SERIAL PRIMARY KEY,
    user_id integer REFERENCES users (id),
    model_id integer REFERENCES models (id),
    prompt text DEFAULT NULL
);