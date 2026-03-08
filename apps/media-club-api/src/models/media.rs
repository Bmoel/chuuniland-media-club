use crate::errors::MyError;
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use strum_macros::{Display, EnumString};

#[derive(Debug, Display, EnumString, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
#[strum(serialize_all = "snake_case")]
pub enum MediaStatus {
    Completed,
    Watching,
    Upcoming,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MediaItem {
    pub id: i64,
    pub date_started: Option<String>,
    pub date_finished: Option<String>,
    pub status: MediaStatus,
}

#[async_trait]
pub trait MediaRepository: Send + Sync {
    async fn get_media_entries(&self) -> Result<Vec<MediaItem>, MyError>;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_media_status_serialize_completed() {
        let json = serde_json::to_string(&MediaStatus::Completed).unwrap();
        assert_eq!(json, "\"completed\"");
    }

    #[test]
    fn test_media_status_serialize_watching() {
        let json = serde_json::to_string(&MediaStatus::Watching).unwrap();
        assert_eq!(json, "\"watching\"");
    }

    #[test]
    fn test_media_status_serialize_upcoming() {
        let json = serde_json::to_string(&MediaStatus::Upcoming).unwrap();
        assert_eq!(json, "\"upcoming\"");
    }

    #[test]
    fn test_media_status_deserialize_completed() {
        let status: MediaStatus = serde_json::from_str("\"completed\"").unwrap();
        assert!(matches!(status, MediaStatus::Completed));
    }

    #[test]
    fn test_media_status_deserialize_watching() {
        let status: MediaStatus = serde_json::from_str("\"watching\"").unwrap();
        assert!(matches!(status, MediaStatus::Watching));
    }

    #[test]
    fn test_media_status_deserialize_upcoming() {
        let status: MediaStatus = serde_json::from_str("\"upcoming\"").unwrap();
        assert!(matches!(status, MediaStatus::Upcoming));
    }

    #[test]
    fn test_media_status_display_completed() {
        assert_eq!(MediaStatus::Completed.to_string(), "completed");
    }

    #[test]
    fn test_media_status_display_watching() {
        assert_eq!(MediaStatus::Watching.to_string(), "watching");
    }

    #[test]
    fn test_media_status_display_upcoming() {
        assert_eq!(MediaStatus::Upcoming.to_string(), "upcoming");
    }

    #[test]
    fn test_media_item_roundtrip() {
        let item = MediaItem {
            id: 42,
            date_started: Some("2024-01-01".to_string()),
            date_finished: Some("2024-06-30".to_string()),
            status: MediaStatus::Completed,
        };
        let json = serde_json::to_string(&item).unwrap();
        let deserialized: MediaItem = serde_json::from_str(&json).unwrap();
        assert_eq!(deserialized.id, 42);
        assert_eq!(deserialized.date_started, Some("2024-01-01".to_string()));
        assert_eq!(deserialized.date_finished, Some("2024-06-30".to_string()));
        assert!(matches!(deserialized.status, MediaStatus::Completed));
    }

    #[test]
    fn test_media_item_watching_roundtrip() {
        let item = MediaItem {
            id: 99,
            date_started: Some("2025-03-01".to_string()),
            date_finished: None,
            status: MediaStatus::Watching,
        };
        let json = serde_json::to_string(&item).unwrap();
        let deserialized: MediaItem = serde_json::from_str(&json).unwrap();
        assert!(matches!(deserialized.status, MediaStatus::Watching));
        assert_eq!(deserialized.date_finished, None);
    }

    #[test]
    fn test_media_item_upcoming_roundtrip() {
        let item = MediaItem {
            id: 123,
            date_started: None,
            date_finished: None,
            status: MediaStatus::Upcoming,
        };
        let json = serde_json::to_string(&item).unwrap();
        let deserialized: MediaItem = serde_json::from_str(&json).unwrap();
        assert_eq!(deserialized.id, 123);
        assert_eq!(deserialized.date_started, None);
        assert_eq!(deserialized.date_finished, None);
        assert!(matches!(deserialized.status, MediaStatus::Upcoming));
    }
}
