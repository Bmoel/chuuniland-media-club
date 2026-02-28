use crate::db::favorites_repo::UserFavoritesRecord;
use crate::errors::MyError;
use crate::models::{
    app::{ApiResponse, AppState},
    users::User,
};
use axum::{extract::{Path, State}, Json};

pub async fn users_route(
    State(state): State<AppState>,
) -> Result<Json<ApiResponse<Vec<User>>>, MyError> {
    let users = state.users_repository.get_users().await?;

    Ok(Json(ApiResponse {
        success: true,
        data: Some(users),
        error: None,
    }))
}

pub async fn users_favorites_get_route(
    State(state): State<AppState>,
    Path((user_id, media_id)): Path<(i64, i64)>,
) -> Result<Json<ApiResponse<UserFavoritesRecord>>, MyError> {
    let favorites = state.favorites_repository.get_user_media_favorites(user_id, media_id).await?;

    Ok(Json(ApiResponse {
        success: true,
        data: Some(favorites),
        error: None,
    }))
}
