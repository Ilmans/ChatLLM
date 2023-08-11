use sqlx::{Pool, Postgres};

pub struct UserRepository {
    pub db: Pool<Postgres>
}

impl UserRepository {
    pub async fn get_users() {

    }

    pub async fn find_user_by_id() {

    }

    pub async fn find_user_by_username(username: String) {

    }
}