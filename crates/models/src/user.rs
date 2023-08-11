
use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct User {
    pub id: i32,
    pub name: String, 
    pub role: String,
    pub username: String,
    pub password: Option<String>,
    pub created_at: Option<DateTime<Utc>>
}