use crate::errors::MyError;
use crate::models::app::{ApiResponse, AppState, PaginatedResponse, PaginationParams};
use crate::models::media::MediaItem;
use axum::extract::Query;
use axum::{extract::State, Json};

pub async fn media_route(
    State(state): State<AppState>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<ApiResponse<PaginatedResponse<MediaItem>>>, MyError> {
    let paginated = state.media_repository.get_media_entries(params).await?;

    Ok(Json(ApiResponse {
        success: true,
        data: Some(paginated),
        error: None,
    }))
}
