use crate::errors::MyError;
use crate::models::app::{ApiResponse, AppState};
use crate::models::media::MediaItem;
use axum::{extract::State, Json};

pub async fn media_route(
    State(state): State<AppState>,
) -> Result<Json<ApiResponse<Vec<MediaItem>>>, MyError> {
    let media_entries = state.media_repository.get_media_entries().await?;

    Ok(Json(ApiResponse {
        success: true,
        data: Some(media_entries),
        error: None,
    }))
}
