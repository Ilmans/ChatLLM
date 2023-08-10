use thiserror::Error;

#[derive(Debug, Error)]
pub enum ServiceError {
    #[error("Could not find the requested resource")]
    NotFound
}