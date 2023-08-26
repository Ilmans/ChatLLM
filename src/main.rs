use std::sync::Arc;

use clap::{Arg, Command, Parser};
use color_eyre;
use config::Config;
use dotenv::dotenv;
use eyre;
use repository::user::UserRepository;
use router::RouterState;
use services::{auth::AuthServiceImpl, user::UserServiceImpl};
use sqlx::{postgres::PgPoolOptions, Pool, Postgres};

#[derive(Debug, Parser)]
#[clap(about = "Rust LLM Server")]
struct Arguments {
    // The command to execute. Possible values: 'migrate' and 'start'
    command: String,
}

#[tokio::main]
async fn main() -> eyre::Result<()> {
    color_eyre::install()?;
    dotenv().ok();

    let args = Command::new("command")
        .arg(
            Arg::new("command")
                .value_parser(["migrate", "start"])
                .default_value("start"),
        )
        .get_matches();
    let command = args.get_one::<String>("command").unwrap();

    // Load the config
    let config = config::load()?;
    tracing::info!("Connecting to database..");

    // Connect to database
    let db = PgPoolOptions::new()
        .max_connections(30)
        .connect(&config.database.url.to_string())
        .await?;

    if command == "migrate" {
        sqlx::migrate!().run(&db).await?;
        return Ok(());
    }
    tracing::info!("Database connected.");
    tracing_subscriber::fmt::init();
    run(config, db).await?;
    Ok(())
}

async fn run(config: Config, db: Pool<Postgres>) -> eyre::Result<()> {
    let user_repository = Arc::from(UserRepository { db });

    let state = RouterState {
        user_service: Arc::from(UserServiceImpl {
            user_repo: user_repository.clone(),
        }),
        auth_service: Arc::from(AuthServiceImpl {
            user_repo: user_repository.clone(),
            jwt_secret: config.jwt_secret,
        }),
    };

    let app = router::router(&state).await;

    tracing::info!("Serving at http://{}", &config.app.host.to_string());
    axum::Server::bind(&config.app.host)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}
