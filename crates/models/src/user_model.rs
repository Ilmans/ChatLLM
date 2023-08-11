
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
struct UserModel {
    pub id: i32,
    pub user_id: i32,
    pub model_id: i32,
    pub prompt: String
}