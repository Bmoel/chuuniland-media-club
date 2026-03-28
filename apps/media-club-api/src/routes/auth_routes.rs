use crate::errors::MyError;
use crate::models::app::{ApiResponse, AppState};
use crate::models::auth::{GenericAuthPayload, LoginResponse};
use crate::services::auth_service;
use axum::{extract::State, Json};

pub async fn auth_sync_route(
    State(state): State<AppState>,
    Json(payload): Json<GenericAuthPayload>,
) -> Result<Json<ApiResponse<()>>, MyError> {
    auth_service::sync_user_profile(&state, &payload.code).await?;
    Ok(Json(ApiResponse {
        success: true,
        data: None,
        error: None,
    }))
}

pub async fn auth_remove_route(
    State(state): State<AppState>,
    Json(payload): Json<GenericAuthPayload>,
) -> Result<Json<ApiResponse<()>>, MyError> {
    auth_service::remove_user_profile(&state, &payload.code).await?;
    Ok(Json(ApiResponse {
        success: true,
        data: None,
        error: None,
    }))
}

pub async fn auth_get_login_info(
    State(state): State<AppState>,
    Json(payload): Json<GenericAuthPayload>,
) -> Result<Json<ApiResponse<LoginResponse>>, MyError> {
    let token = auth_service::get_access_token(&state, &payload.code).await?;
    let user_info = auth_service::get_user_data(&state, &token).await?;

    Ok(Json(ApiResponse {
        success: true,
        data: Some(LoginResponse {
            id: user_info.id,
            access_token: token,
            avatar_url: user_info.avatar.medium,
            name: user_info.name,
        }),
        error: None,
    }))
}