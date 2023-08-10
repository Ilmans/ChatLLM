use config::{load, Config};
use eyre;
use color_eyre;
use sqlx::{Postgres, Pool, postgres::PgPoolOptions};

#[tokio::main]
async fn main()  -> eyre::Result<()>{
    color_eyre::install()?;
    tracing_subscriber::fmt::init();
    run(config::load()?).await;
    Ok(())
}

async fn run(config: Config) -> eyre::Result<()> {
    tracing::info!("Connecting to database..");

    // Connect to database
    let pool = PgPoolOptions::new()
        .max_connections(30)
        .connect(&config.database.url.to_string())
        .await?;

    let app = router::router(state);

    
    Ok(())
}