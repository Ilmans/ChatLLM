use std::sync::Arc;

use repository::user::UserRepository;

pub trait UserService {

}

pub struct UserServiceImpl {
    pub user_repo: Arc<UserRepository>
}

impl UserService for UserServiceImpl {
    
}