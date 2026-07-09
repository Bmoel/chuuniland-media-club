use crate::services::anilist_auth_service;
use crate::{errors::MyError, models::app::AppState};
use crate::models::auth::ViewerInfo;

pub async fn get_access_token(state: &AppState, auth_code: &str) -> Result<String, MyError> {
    anilist_auth_service::exchange_code_for_token(state, auth_code).await
}

pub async fn get_user_data(state: &AppState, token: &str) -> Result<ViewerInfo, MyError> {
    anilist_auth_service::get_anilist_user_data(state, token).await
}

pub async fn sync_user_profile(state: &AppState, auth_code: &str) -> Result<(), MyError> {
    let user_id = query_anilist_api_for_user_id(state, auth_code).await?;
    state.users_repository.add_user(&user_id).await?;
    Ok(())
}

pub async fn remove_user_profile(state: &AppState, auth_code: &str) -> Result<(), MyError> {
    let user_id = query_anilist_api_for_user_id(state, auth_code).await?;
    state.users_repository.remove_user(&user_id).await?;
    Ok(())
}

async fn query_anilist_api_for_user_id(
    state: &AppState,
    auth_code: &str,
) -> Result<i32, MyError> {
    let token = anilist_auth_service::exchange_code_for_token(state, auth_code).await?;
    Ok(anilist_auth_service::get_anilist_user_id(state, &token).await?)
}
