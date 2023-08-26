use axum::{
    extract::State,
    http::StatusCode,
    middleware,
    routing::{get, post},
    Json, Router,
};
use axum_extra::extract::WithRejection;
use errors::api::ApiError;
use lib::jwt::JwtClaims;
use models::user::User;
use serde::Deserialize;
use services::auth::LoginResult;

use crate::{middleware::auth::auth_middleware, response::GeneralResponse, RouterState};

pub async fn router(state: RouterState) -> Router {
    Router::new()
        .route("/login", post(login))
        .route("/register", post(register))
        .route("/user", get(user))
        .route("/logout", post(logout))
        .with_state(state)
}

pub async fn user(
    State(state): State<RouterState>,
    claims: JwtClaims,
) -> Result<GeneralResponse<User>, ApiError> {
    let user = state.auth_service.user(claims.user_id).await?;

    Ok(GeneralResponse::new_with_data(
        StatusCode::OK,
        "Success get user",
        user,
    ))
}

#[derive(Deserialize)]
pub struct LoginUserRequest {
    username: String,
    password: String,
}

pub async fn login(
    State(state): State<RouterState>,
    WithRejection(Json(body), _): WithRejection<Json<LoginUserRequest>, ApiError>,
) -> Result<Json<LoginResult>, ApiError> {
    state
        .auth_service
        .login(body.username, body.password)
        .await
        .map(|data| Json(data))
        .map_err(|e| e.into())
}
pub async fn register(State(state): State<RouterState>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!()
}
pub async fn logout(
    State(state): State<RouterState>,
    claims: JwtClaims,
) -> Result<GeneralResponse<String>, ApiError> {
    Ok(GeneralResponse::new_without_data(
        StatusCode::OK,
        "Logout success",
    ))
}
