use crate::models::auth::{TokenResponse, ViewerResponse};
use crate::models::constants::anilist_constants::{ANILIST_AUTH_URL, ANILIST_GRAPHQL_URL};
use crate::{errors::MyError, models::app::AppState};

pub async fn exchange_code_for_token(state: &AppState, auth_code: &str) -> Result<String, MyError> {
    let payload = serde_json::json!({
        "grant_type": "authorization_code",
        "client_id": state.environment_variables.client_id,
        "client_secret": state.environment_variables.client_secret,
        "redirect_uri": state.environment_variables.redirect_uri,
        "code": auth_code,
    });

    // Use post_raw_json because this isn't a GraphQL query
    let data: TokenResponse = state
        .anilist_client
        .post_raw_json(ANILIST_AUTH_URL, payload)
        .await?;

    Ok(data.access_token)
}

pub async fn get_anilist_user_id(state: &AppState, token: &str) -> Result<i32, MyError> {
    let query = "query { Viewer { id } }";

    let response: ViewerResponse = state
        .anilist_client
        .post_graphql(
            ANILIST_GRAPHQL_URL,
            query,
            serde_json::json!({}),
            Some(token),
        )
        .await?;

    Ok(response.data.viewer.id)
}
