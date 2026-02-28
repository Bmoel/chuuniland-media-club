use crate::services::anilist_service;
use crate::{errors::MyError, models::app::AppState};
use axum::extract::State;

pub async fn sync_user_profile(state: State<AppState>, auth_code: String) -> Result<(), MyError> {
    let user_id = query_anilist_api_for_user_id(&state, &auth_code).await?;
    state.users_repository.add_user(&user_id).await?;
    Ok(())
}

pub async fn remove_user_profile(state: State<AppState>, auth_code: String) -> Result<(), MyError> {
    let user_id = query_anilist_api_for_user_id(&state, &auth_code).await?;
    state.users_repository.remove_user(&user_id).await?;
    Ok(())
}

async fn query_anilist_api_for_user_id(
    state: &AppState,
    auth_code: &str,
) -> Result<i32, MyError> {
    let token = anilist_service::exchange_code_for_token(&state, auth_code).await?;
    Ok(anilist_service::get_anilist_user_id(&state.http_client, &token).await?)
}
