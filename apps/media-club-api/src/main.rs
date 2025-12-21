use aws_sdk_rdsdata as rdsdata;
use axum::{routing::get, Router};
use lambda_http::{run, tracing, Error};
use models::app::ClientState;
use std::{env::{set_var, var}, sync::Arc};
use crate::{db::media_repo::MediaRepo, models::{app::AppState, media::MediaRepository}};

mod models;
mod routes;
mod db;

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Handle removing stage from url
    set_var("AWS_LAMBDA_HTTP_IGNORE_STAGE_IN_PATH", "true");

    // Setup tracing for lambda
    tracing::init_default_subscriber();

    // Setup DB Client
    let config = aws_config::load_from_env().await;
    let client_state = ClientState {
        db_client: rdsdata::Client::new(&config),
        db_resource_arn: var("DB_RESOURCE_ARN").expect("Missing Resource ARN"),
        db_secret_arn: var("DB_SECRET_ARN").expect("Missing Secret ARN"),
        db_name: var("DB_NAME").expect("Missing DB Name"),
    };

    // Create Repositories
    let media_repo = MediaRepo::new(client_state);

    let app_state = AppState {
        media_repository: Arc::new(media_repo) as Arc<dyn MediaRepository + Send + Sync>,
    };

    let app = Router::new()
        .route("", get(routes::common::welcome_route))
        .route("/media", get(routes::media::media_route))
        .route("/users", get(routes::users::users_route))
        .fallback(routes::common::default_route)
        .with_state(app_state);

    run(app).await
}
