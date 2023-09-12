use axum::{
    extract::FromRef,
    http::StatusCode,
    response::{ErrorResponse, IntoResponse},
    routing::get,
    Json, Router,
};
use errors::{api::ApiError, service::ServiceError};
use std::sync::Arc;
use tower::ServiceBuilder;
use tower_http::trace::TraceLayer;

pub mod chat;
pub mod auth;
pub mod home;
pub mod middleware;
pub mod response;
pub mod users;

type UserService = Arc<dyn services::user::UserService + Send + Sync>;
type AuthService = Arc<dyn services::auth::AuthService + Send + Sync>;
type ChatService = Arc<dyn services::chat::ChatService + Send + Sync>;

#[derive(Clone, FromRef)]
pub struct RouterState {
    pub user_service: UserService,
    pub auth_service: AuthService,
    pub chat_service: ChatService
}

pub struct ApiResponse<T> {
    pub message: Option<&'static str>,
    pub data: Option<T>,
}

pub async fn router(state: &RouterState) -> Router {
    Router::new()
        .with_state(state.clone())
        .layer(
            ServiceBuilder::new()
                // Enables logging. Use `RUST_LOG=tower_http=debug`
                .layer(TraceLayer::new_for_http()),
        )
        .route("/", get(home::home))
        .nest(
            "/api/v1",
            Router::new()
                .merge(users::router(state.clone()).await)
                .merge(auth::router(state.clone()).await)
                .merge(chat::router(state.clone()).await),
        )
        .fallback(not_found_handler)
}

pub async fn not_found_handler() -> impl IntoResponse {
    Into::<ApiError>::into(ServiceError::NotFound)
}
