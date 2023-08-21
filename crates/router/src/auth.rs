
use axum::{extract::State, Json, Router, routing::{get, post}, middleware, http::StatusCode};
use axum_extra::extract::WithRejection;
use errors::api::ApiError;
use lib::jwt::JwtClaims;
use models::user::User;
use serde::Deserialize;
use services::auth::LoginResult;

use crate::{RouterState, middleware::auth::auth_middleware, response::GeneralResponse};

pub async fn router(state: RouterState) -> Router {
    Router::new()
        .route("/login", post(login))
        .route("/register", post(register))
        .route("/user", post(user).route_layer(middleware::from_fn_with_state(state.clone(), auth_middleware)))
        .route("/logout", post(logout)).route_layer(middleware::from_fn_with_state(state.clone(), auth_middleware))
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
) -> Result<Json<LoginResult>, ApiError> {
    state.auth_service.login(body.username, body.password)
        .await
        .map(|data| Json(data))
        .map_err(|e| e.into())
}
pub async fn register(State(state): State<RouterState>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!()
}
pub async fn logout(State(state): State<RouterState>, claims: JwtClaims) -> Result<GeneralResponse<String>, ApiError> {
    Ok(GeneralResponse::new_success_without_data("Logout success"))
}