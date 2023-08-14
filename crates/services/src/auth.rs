use std::{sync::Arc, ops::Deref};

use async_trait::async_trait;
use repository::user::UserRepository;
use serde::Serialize;
use crate::error::ServiceError;


pub struct AuthServiceImpl {
    pub user_repo: Arc<UserRepository>
}

#[async_trait]
pub trait AuthService {
    async fn login(&self, username: String, password: String) -> Result<LoginResult, ServiceError>;
    async fn logout(&self) -> Result<(), ServiceError>;
    async fn refresh_user(&self) -> Result<(), ServiceError>;
    async fn user(&self) -> Result<(), ServiceError>;
}

#[derive(Serialize)]
pub struct LoginResult {
    pub user: models::User,
    pub token: String
}

#[async_trait]
impl AuthService for AuthServiceImpl {
    async fn login(&self, username: String, password: String) -> Result<LoginResult, ServiceError> {
        let user = self.user_repo.find_user_by_username(username).await;
        user.map(|user| {
            tracing::debug!("Login user: {:?}", user);
            LoginResult {
                user,
                token: "Test token".to_string() 
            }
        }).map_err(|err| {
            tracing::error!("Error Login user: {:?}", err);
            ServiceError::InvalidCredentials
        })
        
    }
    async fn logout(&self) -> Result<(), ServiceError> {
        unimplemented!()
    }
    async fn refresh_user(&self) -> Result<(), ServiceError> {
        unimplemented!()
    }
    async fn user(&self) -> Result<(), ServiceError> {
        unimplemented!()
    }
}