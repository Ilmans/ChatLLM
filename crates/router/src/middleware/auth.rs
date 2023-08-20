use std::sync::Arc;

use axum::{extract::State, http::Request, middleware::Next, response::{IntoResponse, Response}, Json};
use errors::api::ApiError;

use crate::RouterState;

pub async fn auth_middleware<B>(
    State(state): State<RouterState>,
    request: Request<B>,
    next: Next<B>,
) -> Response {
    let response = next.run(request).await;

    response
}