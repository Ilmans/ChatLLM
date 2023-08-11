use std::sync::Arc;

use clap::{ Command, Parser, Arg};
use config::{ Config};
use eyre;
use color_eyre;
use router::RouterState;
use services::{user::UserServiceImpl, auth::AuthServiceImpl};
use sqlx::{  postgres::PgPoolOptions};

#[derive(Debug, Parser)]
#[clap(about="Rust LLM Server")]
struct Arguments {
    // The command to execute. Possible values: 'migrate' and 'start'
    command: String
}


#[tokio::main]
async fn main()  -> eyre::Result<()>{
    color_eyre::install()?;
    let args = Command::new("command")
        .arg(Arg::new("command").value_parser(["migrate", "start"]).default_value("start"))
        .get_matches();
    let command = args.get_one::<String>("command").unwrap();
    println!("Arguments: {:?}", command);

    // Load the config
    let config = config::load()?;

    // Connect to database
    let db = PgPoolOptions::new()
        .max_connections(30)
        .connect(&config.database.url.to_string())
        .await?;

    if command == "migrate" {
        sqlx::migrate!().run(&db).await?;
        return Ok(());
    }

    tracing_subscriber::fmt::init();
    run(config).await?;
    Ok(())
}

async fn run(config: Config) -> eyre::Result<()> {
    tracing::info!("Connecting to database..");

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