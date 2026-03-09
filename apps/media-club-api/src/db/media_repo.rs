use crate::errors::MyError;
use crate::models::media::MediaItem;
use crate::models::media::MediaRepository;
use async_trait::async_trait;
use aws_sdk_dynamodb::Client;
use std::sync::Arc;

pub(crate) struct MediaRepo {
    client: Arc<Client>,
    table_name: String,
}

impl MediaRepo {
    pub fn new(client_state: Arc<Client>, table_name: String) -> Self {
        Self {
            client: client_state,
            table_name,
        }
    }
}

#[async_trait]
impl MediaRepository for MediaRepo {
    async fn get_media_entries(&self) -> Result<Vec<MediaItem>, MyError> {
        let result = self
            .client
            .scan()
            .table_name(&self.table_name)
            .send()
            .await
            .map_err(|e| MyError::Database(format!("DynamoDB Scan Error: {}", e)))?;

        let items: Vec<MediaItem> = serde_dynamo::from_items(result.items.unwrap_or_default())
            .map_err(|e| MyError::Internal(format!("Serialization error: {}", e)))?;

        Ok(items)
    }
}
