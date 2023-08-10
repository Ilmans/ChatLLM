use std::sync::Arc;
use axum::{Router, routing::get, extract::FromRef, response::{IntoResponse, ErrorResponse}, Json, http::StatusCode};
use error::{ApiError, ApiErrorPayload};
use services::error::ServiceError;

pub mod error;
pub mod users;
pub mod home;


type UserService = Arc<dyn services::user::UserService + Send + Sync>;
type AuthService = Arc<dyn services::auth::AuthService + Send + Sync>;

#[derive(Clone, FromRef)]
pub struct RouterState {
    pub user_service: UserService,
    pub auth_service: AuthService
}

pub struct ApiResponse<T> {
    pub message: Option<&'static str>,
    pub data: Option<T>
}

pub fn router(state: RouterState) -> Router {
    Router::new()
        .route("/", get(home::home))
        .route("/users", get(users::index))
        .fallback(not_found_handler)
        .with_state(state)
}

pub async fn not_found_handler() -> impl IntoResponse {
    Into::<ApiError>::into(ServiceError::NotFound)
}