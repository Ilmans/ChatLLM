use models::user::User;
use sqlx::{Error, Pool, Postgres};

pub struct UserRepository {
    pub db: Pool<Postgres>,
}

impl UserRepository {
    pub fn get_users(&self) {}

    pub async fn find_user_by_id(&self, id: i32) -> Result<User, Error> {
        let user = sqlx::query_as!(
            User,
            r#"SELECT * 
                FROM users 
                WHERE id = $1 
                LIMIT 1"#,
            id
        )
        .fetch_one(&self.db)
        .await?;

        Ok(user)
    }

    pub async fn store(
        &self,
        name: String,
        role: String,
        username: String,
        password: String,
    ) -> Result<(), Error> {
        sqlx::query!(
            "INSERT INTO users (name, role, username, password) VALUES ($1, $2, $3, $4)",
            name,
            role,
            username,
            password
        )
        .execute(&self.db)
        .await?;

        Ok(())
    }

    pub async fn find_user_by_username(&self, username: String) -> Result<User, Error> {
        let user = sqlx::query_as!(User, r#"SELECT id as "id!", name as "name!", password as "password!", created_at, role as "role!", username as "username!"  FROM users WHERE username = $1 LIMIT 1"#, 
            username
        )
        .fetch_one(&self.db)
        .await?;

        Ok(user)
    }
}
