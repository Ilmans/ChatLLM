use std::{fmt::format, collections::HashMap};

use axum::{http::StatusCode, response::IntoResponse, Json};
use serde::{Serialize, Deserialize};

use crate::service::ServiceError;


#[derive(Debug, Serialize, Deserialize)]
pub struct ApiErrorPayload {
    // pub code: &'static str,
    pub message: String,

    #[serde(skip_serializing_if="Option::is_none")]
    pub errors: Option<HashMap<String, String>>
}

#[derive(Debug)]
pub struct ApiError {
    pub status: StatusCode,
    pub payload: ApiErrorPayload
}

impl From<ServiceError> for ApiError {
    fn from(value: ServiceError) -> Self {
        let (status, message, errors) = match value {
            ServiceError::InternalServerError(message) => (StatusCode::INTERNAL_SERVER_ERROR, message, None),
            ServiceError::AlreadyExist(message) => (StatusCode::CONFLICT, message, None),
            ServiceError::DatabaseError(message) => (StatusCode::INTERNAL_SERVER_ERROR, message.to_string(), None),
            ServiceError::Unauthorized =>  (StatusCode::UNAUTHORIZED, "Unauthorized".into(), None),
            ServiceError::NotFound =>  (StatusCode::NOT_FOUND, "Not found".into(), None),
        };
        ApiError { 
            status, 
            payload: ApiErrorPayload { 
                message, 
                errors 
            } 
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
                        // code: $code,
                        message: format!("{value}"),
                        errors: None
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