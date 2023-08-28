use std::os::fd::IntoRawFd;

use axum::{extract::State, http::StatusCode, response::IntoResponse, routing::get, Json, Router};
use axum_extra::extract::WithRejection;
use errors::api::ApiError;
use models::user::User;
use serde::Deserialize;

use crate::{
    response::{GeneralResponse},
    RouterState,
};

pub async fn router(state: RouterState) -> Router {
    Router::new()
        .route("/chat", get(index).post(send_message))
        .with_state(state)
}

pub async fn index(State(state): State<RouterState>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!()
}

#[derive(Deserialize)]
pub struct SendMessagePayload {
    message: String
}

pub async fn send_message(
    State(service): State<RouterState>,
    WithRejection(Json(body), _): WithRejection<Json<SendMessagePayload>, ApiError>,
) -> Result<GeneralResponse<String>, ApiError> {
    let result = service.chat_service.send_message(body.message).await 
        .map(|_| GeneralResponse::new_without_data(StatusCode::OK, "Send message success"))?;
    Ok(result)
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
