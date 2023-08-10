use axum::{Json, response::IntoResponse};
use serde_json;

pub async fn home() -> impl IntoResponse {
    Json(serde_json::json!({
        "message": "Welcome to Rust LLM!"
    }))
}