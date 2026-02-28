use async_trait::async_trait;
use aws_sdk_dynamodb::{types::AttributeValue, Client};
use serde::Serialize;
use std::sync::Arc;

use crate::errors::MyError;

// NOTE: This table requires a composite primary key in DynamoDB:
//   Partition key: user_id (N)
//   Sort key:      media_id (N)
#[derive(Serialize)]
pub struct UserFavoritesRecord {
    pub user_id: i64,
    pub media_id: i64,
    pub character_ids: Vec<i32>,
}

#[async_trait]
pub trait FavoritesRepository: Send + Sync {
    async fn get_user_media_favorites(&self, user_id: i64, media_id: i64) -> Result<UserFavoritesRecord, MyError>;
    async fn upsert_user_favorites(&self, record: UserFavoritesRecord) -> Result<(), MyError>;
}

pub struct DynamoFavoritesRepo {
    client: Arc<Client>,
    table_name: String,
}

impl DynamoFavoritesRepo {
    pub fn new(client: Arc<Client>, table_name: String) -> Self {
        Self { client, table_name }
    }
}

#[async_trait]
impl FavoritesRepository for DynamoFavoritesRepo {
    async fn get_user_media_favorites(&self, user_id: i64, media_id: i64) -> Result<UserFavoritesRecord, MyError> {
        let result = self
            .client
            .get_item()
            .table_name(&self.table_name)
            .key("user_id", AttributeValue::N(user_id.to_string()))
            .key("media_id", AttributeValue::N(media_id.to_string()))
            .send()
            .await
            .map_err(|e| MyError::Database(format!("DynamoDB GetItem Error: {}", e)))?;

        let character_ids = result
            .item
            .as_ref()
            .and_then(|item| item.get("character_ids"))
            .and_then(|attr| attr.as_ns().ok())
            .map(|ns| {
                ns.iter()
                    .filter_map(|s| s.parse::<i32>().ok())
                    .collect()
            })
            .unwrap_or_default();

        Ok(UserFavoritesRecord { user_id, media_id, character_ids })
    }

    async fn upsert_user_favorites(&self, record: UserFavoritesRecord) -> Result<(), MyError> {
        if record.character_ids.is_empty() {
            return Ok(());
        }

        let mut request = self
            .client
            .put_item()
            .table_name(&self.table_name)
            .item("user_id", AttributeValue::N(record.user_id.to_string()))
            .item("media_id", AttributeValue::N(record.media_id.to_string()));

        if !record.character_ids.is_empty() {
            let ns: Vec<String> = record.character_ids.iter().map(|id| id.to_string()).collect();
            request = request.item("character_ids", AttributeValue::Ns(ns));
        }

        request
            .send()
            .await
            .map_err(|e| MyError::Database(format!("DynamoDB PutItem Error: {}", e)))?;

        Ok(())
    }
}
