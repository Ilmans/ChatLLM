use std::sync::Arc;

use async_trait::async_trait;
use repository::user::UserRepository;

use crate::error::ServiceError;

#[async_trait]
pub trait UserService {
    async fn store(&self, name: String, role: String, username: String, password: String) -> Result<(), ServiceError>;
}

pub struct UserServiceImpl {
    pub user_repo: Arc<UserRepository>
}

#[async_trait]
impl UserService for UserServiceImpl {
    async fn store(&self, name: String, role: String, username: String, password: String) -> Result<(), ServiceError> {
        let check_user = self.user_repo.find_user_by_username(username.to_owned()).await;
        if check_user.is_ok() {
            return Err(ServiceError::AlreadyExist("User already exist".to_string()));
        } 

        self.user_repo.store(name.to_owned(), role.to_owned(), username.to_owned(), password.to_owned())
            .await?;

        Ok(())
    }
}