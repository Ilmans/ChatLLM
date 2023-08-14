use chrono::{DateTime, Utc, NaiveDateTime};
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

#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub username: String,
    pub password: String,
    pub role: Option<String>,
    pub created_at: Option<NaiveDateTime>,
}