use std::os::fd::IntoRawFd;

use axum::{extract::State, Json, Router, routing::get, http::StatusCode, response::IntoResponse};
use axum_extra::extract::WithRejection;
use errors::api::ApiError;
use models::user::User;
use serde::Deserialize;

use crate::{UserService, RouterState, response::{GeneralResponse, ResponseBody}};

pub async fn router(state: RouterState) -> Router {
    Router::new()
        .route("/users", get(index).post(store))
        .route("/users/:user_id", get(show).post(update).delete(destroy))
        .with_state(state)
}

pub async fn index(State(state): State<RouterState>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!()
}

#[derive(Deserialize)]
pub struct StoreUserPayload {
    pub name: String,
    pub role: String,
    pub username: String,
    pub password: String,
}

pub async fn store(
    State(service): State<RouterState>,
    WithRejection(Json(body), _): WithRejection<Json<StoreUserPayload>, ApiError>
) -> Result<impl IntoResponse, ApiError> {
    service.user_service.store(body.name, body.role, body.username, body.password)
        .await?;
    Ok(
        GeneralResponse::<()>::new_without_data(StatusCode::CREATED, "Success create user")
    )
}
pub async fn show(State(service): State<RouterState>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!();
}
pub async fn update(State(service): State<RouterState>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!();
}
pub async fn destroy(State(service): State<RouterState>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!();
}
