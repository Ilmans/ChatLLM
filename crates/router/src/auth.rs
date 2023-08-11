
use axum::{extract::State, Json, Router, routing::{get, post}};
use axum_extra::extract::WithRejection;
use models::User;
use serde::Deserialize;

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

#[derive(Deserialize)]
pub struct LoginUserRequest {
    username: String,
    password: String
}


pub async fn login(
    State(state): State<RouterState>,
    WithRejection(Json(body), _): WithRejection<Json<LoginUserRequest>, ApiError>
) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!()
}
pub async fn register(State(state): State<RouterState>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!()
}
pub async fn logout(State(state): State<RouterState>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!()
}