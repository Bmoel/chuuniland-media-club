use axum::{routing::get, Router};
use lambda_http::{run, tracing, Error};
use std::env::set_var;

mod routes;

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Handle removing stage from url
    set_var("AWS_LAMBDA_HTTP_IGNORE_STAGE_IN_PATH", "true");

    tracing::init_default_subscriber();

    let app = Router::new()
        .route("", get(routes::common::welcome_route))
        .route("/media", get(routes::media::media_route))
        .route("/users", get(routes::users::users_route))
        .fallback(routes::common::default_route);

    run(app).await
}
