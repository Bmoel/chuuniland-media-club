use aws_sdk_rdsdata::{Client, types::{RecordsFormatType}};
use crate::models::{app::ClientState, media::MediaItem};
use crate::models::media::MediaRepository;
use async_trait::async_trait;

pub(crate) struct MediaRepo {
    client: Client,
    resource_arn: String,
    secret_arn: String,
    database: String,
}

impl MediaRepo {
    pub fn new(client_state: ClientState) -> Self {
        Self {
            client: client_state.db_client,
            resource_arn: client_state.db_resource_arn,
            database: client_state.db_name,
            secret_arn: client_state.db_secret_arn,
        }
    }
}

#[async_trait]
impl MediaRepository for MediaRepo {
    async fn get_media_entries(&self) -> Result<Vec<MediaItem>, String> {
        let result = self.client.execute_statement()
            .resource_arn(&self.resource_arn)
            .secret_arn(&self.secret_arn)
            .database(&self.database)
            .sql("SELECT anilist_id, date_started, date_ended, status FROM media")
            .format_records_as(RecordsFormatType::Json)
            .send()
            .await
            .map_err(|e| format!("RDS Error: {}", e))?;

        let json_string = result.formatted_records().unwrap_or("[]");

        let items: Vec<MediaItem> = serde_json::from_str(json_string)
            .map_err(|e| format!("Serialization Error: {}", e))?;

        Ok(items)
    }
}