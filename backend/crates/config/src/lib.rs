use figment::providers::{Format, Toml};
use figment::Figment;
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;

mod app;
mod database;

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    pub jwt_secret: String,
    pub app: app::AppConfig,
    pub database: database::DatabaseConfig,
}

pub fn load() -> Result<Config, figment::error::Error> {
    Figment::new().merge(Toml::file("config.toml")).extract()
}
