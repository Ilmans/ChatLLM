use thiserror::Error;

pub enum ServiceError {
    #[error("Could not find the requested resource")]
    NotFound
}