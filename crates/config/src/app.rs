use serde::{Serialize, Deserialize};
use std::net::SocketAddr;

#[derive(Debug, Serialize, Deserialize)]
pub struct AppConfig {
    pub host: SocketAddr,
}