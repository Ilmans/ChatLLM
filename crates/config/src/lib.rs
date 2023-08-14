use std::net::SocketAddr;
use figment::Figment;
use figment::providers::{Toml, Format};
use serde::{Serialize, Deserialize};

mod database;
mod app;

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    pub hmac_key: String,
    pub app: app::AppConfig,
    pub database: database::DatabaseConfig,
}

pub fn load() -> Result<Config, figment::error::Error> {
    Figment::new()
        .merge(Toml::file("config.toml"))
        .extract()
}

