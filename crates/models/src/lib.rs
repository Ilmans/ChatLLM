use serde::{Serialize, Deserialize};

pub mod user;
pub mod user_model_message;
pub mod model;

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