use serde::{Serialize, Deserialize};
use std::net::SocketAddr;

#[derive(Debug, Serialize, Deserialize)]
pub struct AppConfig {
    host: SocketAddr,
    port: i32
}