use axum::http::StatusCode;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiErrorPayload {
    pub code: &'static str,
    pub message: String 
}

#[derive(Debug)]
pub struct ApiError {
    pub status: StatusCode,
    pub payload: ApiErrorPayload
}
