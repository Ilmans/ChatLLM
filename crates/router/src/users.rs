use axum::{extract::State, Json};
use models::User;

use crate::{UserService, error::ApiError, RouterState};

pub async fn index(State(state): State<RouterState>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!()
}
pub async fn store(State(service): State<UserService>) -> Result<Json<Vec<User>>, ApiError> {
    unimplemented!();
}