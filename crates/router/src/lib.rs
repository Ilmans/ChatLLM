use std::sync::Arc;
use axum::{Router, routing::get, extract::FromRef};

pub mod error;
pub mod users;


type UserService = Arc<dyn services::user::UserService + Send + Sync>;
type AuthService = Arc<dyn services::auth::AuthService + Send + Sync>;

#[derive(Clone, FromRef)]
pub struct RouterState {
    pub user_service: UserService,
    pub auth_service: AuthService
}

pub fn router(state: RouterState) -> Router {
    Router::new()
        .route("/users", get(users::index))
        .with_state(state)
}