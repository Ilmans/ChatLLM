use thiserror::Error;

#[derive(Debug, Error)]
pub enum ServiceError {
    #[error("Invalid Credentials")]
    InvalidCredentials,

    #[error("{0}")]
    AlreadyExist(String),

    #[error(transparent)]
    DatabaseError(#[from] sqlx::error::Error),

    #[error("Could not find the requested resource")]
    NotFound
}