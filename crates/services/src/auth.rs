use std::sync::Arc;

use async_trait::async_trait;
use repository::user::UserRepository;

use crate::error::ServiceError;


pub struct AuthServiceImpl {
    pub user_repo: Arc<UserRepository>
}

#[async_trait]
pub trait AuthService {
    async fn login(&self, username: String, password: String) -> Result<String, bool> {
        unimplemented!()
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


impl AuthService for AuthServiceImpl {
    
}