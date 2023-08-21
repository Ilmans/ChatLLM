use std::{sync::Arc, ops::Deref};

use async_trait::async_trait;
use ::chrono::{Days, Duration};
use errors::service::ServiceError;
use jsonwebtoken::{encode, Header, EncodingKey};
use lib::jwt::JwtClaims;
use models::user::User;
use repository::user::UserRepository;
use serde::{Serialize, Deserialize};
use sqlx::types::chrono;


pub struct AuthServiceImpl {
    pub jwt_secret: String,
    pub user_repo: Arc<UserRepository>
}

#[async_trait]
pub trait AuthService {
    async fn login(&self, username: String, password: String) -> Result<LoginResult, ServiceError>;
    async fn logout(&self) -> Result<(), ServiceError>;
    async fn refresh_user(&self) -> Result<(), ServiceError>;
    async fn user(&self, user_id: i32) -> Result<User, ServiceError>;
}

#[derive(Serialize)]
pub struct LoginResult {
    pub user: models::user::User,
    pub token: String
}



#[async_trait]
impl AuthService for AuthServiceImpl {
    async fn login(&self, username: String, password: String) -> Result<LoginResult, ServiceError> {
        let mut find_user = self.user_repo.find_user_by_username(username).await;

        if find_user.is_err() {
            tracing::error!("Error Login user: {:?}", find_user);
            return Err(ServiceError::Unauthorized);
        }

        let mut user = find_user.unwrap();

        tracing::debug!("Login user: {:?}", user);
        
        // hide from response
        user.password = None;

        let expired_in = chrono::Local::now() + Duration::days(1);
        
        // Generate jwt token
        let claims = JwtClaims {
            exp: expired_in.timestamp(),
            username: user.username.clone(),
            user_id: user.id.clone()
        };
        let token = encode(
            &Header::default(), 
            &claims, 
            &EncodingKey::from_secret(self.jwt_secret.as_ref())
        ).map_err(|err| ServiceError::InternalServerError("auth_jwt".into()))?;
        Ok(LoginResult {
            user,
            token
        })
    }
    async fn logout(&self) -> Result<(), ServiceError> {
        Ok(())
    }
    async fn refresh_user(&self) -> Result<(), ServiceError> {
        unimplemented!()
    }
    async fn user(&self, user_id: i32) -> Result<User, ServiceError> {
        let user = self.user_repo.find_user_by_id(user_id).await?;
        Ok(user)
    }
}