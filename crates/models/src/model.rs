use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Model {
    pub id: i32,
    pub name: String,
    pub realname: String,
    pub path: String,
    pub top_p: f32,
    pub top_k: f32,
    pub temperature: f32,
    pub repeat_penalty: f32,
    pub repeat_last_n: f32,
    pub num_threads: i32,
    pub status: String,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}
