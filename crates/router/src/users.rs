use axum::{extract::State, Json, Router, routing::get};
use models::User;

use crate::{UserService, error::ApiError, RouterState};

pub async fn router(state: RouterState) -> Router {
    Router::new()
        .route("/users", get(index).post(store))
        .route("/users/:user_id", get(show).post(update).delete(destroy))
        .with_state(state)

}

pub async fn index(State(state): State<RouterState>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!()
}
pub async fn store(State(service): State<UserService>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!();
}
pub async fn show(State(service): State<UserService>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!();
}
pub async fn update(State(service): State<UserService>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!();
}
pub async fn destroy(State(service): State<UserService>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!();
}
