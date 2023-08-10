use async_trait::async_trait;

use crate::error::ServiceError;

#[async_trait]
pub trait AuthService {
    async fn login(&self) -> Result<(), ServiceError> {
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

pub struct AuthServiceImpl {

}

impl AuthService for AuthServiceImpl {
    
}