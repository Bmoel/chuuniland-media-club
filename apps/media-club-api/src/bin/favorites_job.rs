use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use media_club_api::{config, services::favorites_sync_service};
use serde_json::Value;

#[tokio::main]
async fn main() -> Result<(), Error> {
    config::init_environment();
    config::init_telemetry();

    run(service_fn(handler)).await
}

async fn handler(_event: LambdaEvent<Value>) -> Result<Value, Error> {
    let state = config::startup_app_state().await?;
    let users_synced = favorites_sync_service::sync_all_user_favorites(&state).await?;

    Ok(serde_json::json!({ "status": "ok", "users_synced": users_synced }))
}
