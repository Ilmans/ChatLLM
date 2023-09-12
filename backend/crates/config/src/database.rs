use serde::{Deserialize, Serialize};
use std::net::SocketAddr;

#[derive(Debug, Serialize, Deserialize)]
pub struct DatabaseConfig {
    pub url: String,
}
