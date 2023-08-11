
use axum::{extract::State, Json, Router, routing::{get, post}};
use models::User;

use crate::{RouterState, error::ApiError};
pub async fn router(state: RouterState) -> Router {
    Router::new()
        .route("/login", post(login))
        .route("/user", post(user))
        .route("/logout", post(logout))
        .route("/register", post(register))
        .with_state(state)
}

pub async fn user(State(state): State<RouterState>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!()
}
pub async fn login(State(state): State<RouterState>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!()
}
pub async fn register(State(state): State<RouterState>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!()
}
pub async fn logout(State(state): State<RouterState>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!()
}