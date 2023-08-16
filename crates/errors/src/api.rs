use std::fmt::format;

use axum::{http::StatusCode, response::IntoResponse, Json};
use serde::{Serialize, Deserialize};

use crate::service::ServiceError;


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

impl From<ServiceError> for ApiError {
    fn from(value: ServiceError) -> Self {
        match value {
            ServiceError::InternalServerError(message) => ApiError {
                status: StatusCode::INTERNAL_SERVER_ERROR,
                payload: ApiErrorPayload { code: "internal_server_error", message }
            },
            ServiceError::AlreadyExist(message) => ApiError {
                status: StatusCode::CONFLICT,
                payload: ApiErrorPayload { code: "conflict", message }
            },
            all @ ServiceError::Unauthorized => ApiError {
                status: StatusCode::UNAUTHORIZED,
                payload: ApiErrorPayload { code: "unauthorized", message: format!("{all}") }
            },
            all @ ServiceError::DatabaseError(_) => ApiError {
                status: StatusCode::INTERNAL_SERVER_ERROR,
                payload: ApiErrorPayload { code: "database_failure", message: format!("{all}") }
            },
            all @ ServiceError::NotFound => ApiError {
                status: StatusCode::NOT_FOUND,
                payload: ApiErrorPayload { code: "not_found", message: format!("{all}") }
            },
        }
    }
}

macro_rules! impl_from_rejection_for_apierror {
    ($rejection:ty, $code:expr, $status:expr) => {
        impl From<$rejection> for ApiError {
            fn from(value: $rejection) -> Self {
                ApiError {
                    status: $status,
                    payload: ApiErrorPayload {
                        code: $code,
                        message: format!("{value}")
                    }
                }
            }
        }
    };
}

impl_from_rejection_for_apierror!(
    axum::extract::rejection::PathRejection,
    "bad_request",
    StatusCode::BAD_REQUEST
);
impl_from_rejection_for_apierror!(
    axum::extract::rejection::JsonRejection,
    "bad_request",
    StatusCode::BAD_REQUEST
);
impl IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        (self.status, Json(self.payload)).into_response()
    }
}