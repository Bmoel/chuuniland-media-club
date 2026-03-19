use crate::db::{favorites_repo::DynamoFavoritesRepo, media_repo::MediaRepo, users_repo::UsersRepo};
use crate::errors::MyError;
use crate::models::app::{AppState, EnvironmentVariables};
use crate::services::throttled_client::ThrottledClient;
use aws_sdk_dynamodb::Client;
use governor::{Quota, RateLimiter};
use std::num::NonZeroU32;
use std::sync::Arc;
use tracing_subscriber::EnvFilter;

pub fn init_environment() {
    dotenvy::dotenv().ok();
}

pub fn init_telemetry() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .with_ansi(false)
        .without_time()
        .init();
}

pub async fn build_dynamo_client() -> Arc<Client> {
    let config = if let Ok(local_url) = std::env::var("DYNAMO_LOCAL_ENDPOINT") {
        aws_config::defaults(aws_config::BehaviorVersion::latest())
            .endpoint_url(local_url)
            .load()
            .await
    } else {
        let region_provider =
            aws_config::meta::region::RegionProviderChain::default_provider().or_else("us-east-2");

        aws_config::defaults(aws_config::BehaviorVersion::latest())
            .region(region_provider)
            .load()
            .await
    };

    Arc::new(Client::new(&config))
}

pub async fn startup_app_state() -> Result<AppState, MyError> {
    let environment_vars = get_environment_variables()?;
    let client = build_dynamo_client().await;
    let http_client = reqwest::Client::builder()
        .user_agent("MediaClub-API/1.0")
        .tls_backend_rustls()
        .timeout(std::time::Duration::from_secs(10))
        .build()
        .map_err(|e| MyError::Internal(format!("Failed to establish http client: {}", e)))?;
    let quota =
        Quota::per_minute(NonZeroU32::new(30).unwrap()).allow_burst(NonZeroU32::new(10).unwrap());
    let limiter = RateLimiter::direct(quota);

    let throttled_client = ThrottledClient::new(http_client, Arc::new(limiter));

    Ok(AppState {
        media_repository: Arc::new(MediaRepo::new(
            Arc::clone(&client),
            environment_vars.media_table_name.to_string(),
        )),
        users_repository: Arc::new(UsersRepo::new(
            Arc::clone(&client),
            environment_vars.users_table_name.to_string(),
        )),
        favorites_repository: Arc::new(DynamoFavoritesRepo::new(
            Arc::clone(&client),
            environment_vars.favorites_table_name.to_string(),
        )),
        anilist_client: Arc::new(throttled_client),
        environment_variables: environment_vars,
    })
}

fn get_environment_variables() -> Result<EnvironmentVariables, MyError> {
    let media_table_name = std::env::var("DB_NAME_MEDIA")
        .map_err(|_| MyError::Internal("Failed to find DB_NAME_MEDIA".into()))?;
    let users_table_name = std::env::var("DB_NAME_USERS")
        .map_err(|_| MyError::Internal("Failed to find DB_NAME_USERS".into()))?;
    let favorites_table_name = std::env::var("DB_NAME_FAVORITES")
        .map_err(|_| MyError::Internal("Failed to find DB_NAME_FAVORITES".into()))?;
    let client_id = std::env::var("ANILIST_CLIENT_APP_ID")
        .map_err(|_| MyError::Internal("Failed to find ANILIST_CLIENT_APP_ID".into()))?;
    let client_secret = std::env::var("ANILIST_CLIENT_APP_SECRET")
        .map_err(|_| MyError::Internal("Failed to find ANILIST_CLIENT_APP_SECRET".into()))?;
    let redirect_uri = std::env::var("ANILIST_REDIRECT_URI")
        .map_err(|_| MyError::Internal("Failed to find ANILIST_REDIRECT_URI".into()))?;

    Ok(EnvironmentVariables {
        media_table_name,
        users_table_name,
        favorites_table_name,
        client_id,
        client_secret,
        redirect_uri,
    })
}
