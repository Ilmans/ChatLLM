
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct UserModelMessage {
    pub id: i32,
    pub user_model_id: i32,
    pub message: String,
    pub who: String
}