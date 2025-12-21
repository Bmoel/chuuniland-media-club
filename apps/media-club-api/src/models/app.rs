use crate::{models::media::MediaRepository};
use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {
    pub media_repository: Arc<dyn MediaRepository + Send + Sync>,
}

pub struct ClientState {
    pub db_client: aws_sdk_rdsdata::Client,
    pub db_resource_arn: String,
    pub db_secret_arn: String,
    pub db_name: String,
}
