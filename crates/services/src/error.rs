use thiserror::Error;

#[derive(Debug, Error)]
pub enum ServiceError {

    #[error(transparent)]
    DatabaseError(#[from] sqlx::error::Error),

    #[error("Could not find the requested resource")]
    NotFound
}