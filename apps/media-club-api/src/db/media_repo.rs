use crate::errors::MyError;
use crate::models::app::{PaginatedResponse, PaginationParams};
use crate::models::media::MediaItem;
use crate::models::media::MediaRepository;
use async_trait::async_trait;
use aws_sdk_dynamodb::types::{AttributeValue, Select};
use aws_sdk_dynamodb::Client;
use std::collections::HashMap;
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

    async fn count_all_items(&self) -> Result<usize, MyError> {
        let mut total = 0usize;
        let mut last_key: Option<HashMap<String, AttributeValue>> = None;
        loop {
            let result = self
                .client
                .scan()
                .table_name(&self.table_name)
                .select(Select::Count)
                .set_exclusive_start_key(last_key)
                .send()
                .await
                .map_err(|e| MyError::Database(format!("DynamoDB Count Error: {}", e)))?;
            total += result.count as usize;
            last_key = result.last_evaluated_key;
            if last_key.is_none() {
                break;
            }
        }
        Ok(total)
    }

    async fn find_page_start_key(
        &self,
        page: usize,
        per_page: i32,
    ) -> Result<Option<HashMap<String, AttributeValue>>, MyError> {
        if page == 1 {
            return Ok(None);
        }
        let mut items_to_skip = (page - 1) * per_page as usize;
        let mut last_key: Option<HashMap<String, AttributeValue>> = None;
        while items_to_skip > 0 {
            let batch = items_to_skip.min(per_page as usize) as i32;
            let result = self
                .client
                .scan()
                .table_name(&self.table_name)
                .limit(batch)
                .set_exclusive_start_key(last_key)
                .send()
                .await
                .map_err(|e| MyError::Database(format!("DynamoDB Walk Error: {}", e)))?;
            last_key = result.last_evaluated_key;
            items_to_skip -= batch as usize;
            if last_key.is_none() {
                break; // past end of table
            }
        }
        Ok(last_key)
    }
}

#[async_trait]
impl MediaRepository for MediaRepo {
    async fn get_media_entries(
        &self,
        params: PaginationParams,
    ) -> Result<PaginatedResponse<MediaItem>, MyError> {
        let per_page = params.per_page.clamp(1, 25);
        let page = params.page.max(1) as usize;

        let total_count = self.count_all_items().await?;
        let total_pages = total_count.div_ceil(per_page as usize).max(1) as u32;

        let start_key = self.find_page_start_key(page, per_page as i32).await?;

        let result = self
            .client
            .scan()
            .table_name(&self.table_name)
            .limit(per_page as i32)
            .set_exclusive_start_key(start_key)
            .send()
            .await
            .map_err(|e| MyError::Database(format!("DynamoDB Scan Error: {}", e)))?;

        let items: Vec<MediaItem> =
            serde_dynamo::from_items(result.items.unwrap_or_default())
                .map_err(|e| MyError::Internal(format!("Serialization error: {}", e)))?;

        Ok(PaginatedResponse {
            items,
            total_count,
            page: page as u32,
            per_page,
            total_pages,
        })
    }
}
