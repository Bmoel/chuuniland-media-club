use crate::errors::MyError;
use crate::models::app::{PaginatedResponse, PaginationParams};
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
    async fn get_media_entries(
        &self,
        params: PaginationParams,
    ) -> Result<PaginatedResponse<MediaItem>, MyError> {
        let result = self
            .client
            .scan()
            .table_name(&self.table_name)
            .send()
            .await
            .map_err(|e| MyError::Database(format!("DynamoDB Scan Error: {}", e)))?;

        let mut all_items: Vec<MediaItem> =
            serde_dynamo::from_items(result.items.unwrap_or_default())
                .map_err(|e| MyError::Internal(format!("Serialization error: {}", e)))?;

        all_items.sort_by_key(|m| m.id);

        let total_count = all_items.len();
        let per_page = params.per_page.clamp(1, 25) as usize;
        let page = params.page.max(1) as usize;
        let total_pages = total_count.div_ceil(per_page).max(1) as u32;

        let skip = (page - 1) * per_page;
        let items = all_items.into_iter().skip(skip).take(per_page).collect();

        Ok(PaginatedResponse {
            items,
            total_count,
            page: page as u32,
            per_page: per_page as u32,
            total_pages,
        })
    }
}
