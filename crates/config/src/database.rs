use serde::{Serialize, Deserialize};
use std::net::SocketAddr;

#[derive(Debug, Serialize, Deserialize)]
pub struct DatabaseConfig {
    pub url: SocketAddr,
}