use std::sync::Arc;

use config::{load, Config};
use eyre;
use color_eyre;
use router::RouterState;
use services::{user::UserServiceImpl, auth::AuthServiceImpl};
use sqlx::{Postgres, Pool, postgres::PgPoolOptions};

#[tokio::main]
async fn main()  -> eyre::Result<()>{
    color_eyre::install()?;
    tracing_subscriber::fmt::init();
    run(config::load()?).await?;
    Ok(())
}

async fn run(config: Config) -> eyre::Result<()> {
    tracing::info!("Connecting to database..");

    // Connect to database
    let pool = PgPoolOptions::new()
        .max_connections(30)
        .connect(&config.database.url.to_string())
        .await?;
    tracing::info!("Database connected.");

    let state = RouterState {
        user_service: Arc::from(UserServiceImpl {}),
        auth_service: Arc::from(AuthServiceImpl {})
    };

    let app = router::router(&state).await;
    
    tracing::info!("Serving at {}", &config.app.host.to_string());
    axum::Server::bind(&config.app.host)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}