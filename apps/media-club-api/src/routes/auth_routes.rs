use crate::errors::MyError;
use crate::models::app::{ApiResponse, AppState};
use crate::models::auth::{GenericAuthPayload};
use crate::services::auth_service;
use axum::{extract::State, Json};

pub async fn auth_sync_route(
    State(state): State<AppState>,
    Json(payload): Json<GenericAuthPayload>,
) -> Result<Json<ApiResponse<()>>, MyError> {
    auth_service::sync_user_profile(State(state), payload.code).await?;
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
    auth_service::remove_user_profile(State(state), payload.code).await?;
    Ok(Json(ApiResponse {
        success: true,
        data: None,
        error: None,
    }))
}

pub async fn auth_get_token(
    State(state): State<AppState>,
    Json(payload): Json<GenericAuthPayload>,
) -> Result<Json<ApiResponse<String>>, MyError> {
    let token = auth_service::get_access_token(State(state), payload.code).await?;
    Ok(Json(ApiResponse {
        success: true,
        data: Some(token),
        error: None,
    }))
}