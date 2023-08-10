
use axum::{extract::State, Json, Router, routing::{get, post}};
use models::User;

use crate::{RouterState, error::ApiError};
pub async fn router(state: RouterState) -> Router {
    Router::new()
        .route("/login", post(login))
        .route("/logout", post(login))
        .route("/register", post(login))
        .with_state(state)
}

pub async fn login(State(state): State<RouterState>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!()
}