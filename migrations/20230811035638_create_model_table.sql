-- Add migration script here
CREATE TABLE models (
    id SERIAL PRIMARY KEY,
    name varchar(255),
    realname varchar(255),
    path text,
    top_p float,
    top_k float,
    temperature float,
    repeat_penalty float,
    repeat_last_n float,
    num_threads int,
    status boolean,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);