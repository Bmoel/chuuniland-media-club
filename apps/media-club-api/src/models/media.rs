use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use strum_macros::{Display, EnumString};
use async_trait::async_trait;

#[derive(Debug, Display, EnumString, Serialize, Deserialize)]
#[strum(serialize_all = "snake_case")]
pub enum MediaStatus {
    #[strum(serialize = "completed")]
    Completed,
    #[strum(serialize = "watching")]
    Watching,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MediaItem {
    pub anilist_id: i64,
    pub date_started: NaiveDate,
    pub date_ended: Option<NaiveDate>,
    pub status: MediaStatus,
}

#[async_trait]
pub trait MediaRepository: Send + Sync {
    async fn get_media_entries(&self) -> Result<Vec<MediaItem>, String>;
}