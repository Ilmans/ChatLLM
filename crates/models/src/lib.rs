use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub enum UserRole {
    Admin,
    User
} 

impl UserRole {
    pub fn as_str(&self ) -> &'static str {
        match self {
            Self::Admin => "Admin",
            Self::User => "User",
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct User {
    id: i32,
    name: String,
    role: UserRole,
    created_at: String,
}