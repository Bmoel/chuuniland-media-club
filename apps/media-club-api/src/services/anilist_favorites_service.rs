use crate::models::app::AppState;
use crate::models::favorites::FavoritesPayload;
use crate::{
    errors::MyError,
    models::{
        constants::anilist_constants::ANILIST_GRAPHQL_URL,
        favorites::{AniListResponse, CharacterFavs, CharacterResponse, FavoritesResponse},
    },
};
use std::collections::HashSet;

pub async fn get_user_favorites(
    state: &AppState,
    payload: FavoritesPayload,
) -> Result<FavoritesResponse, MyError> {
    let media_club_media = state.media_repository.get_media_entries().await?;
    let media_id_set: HashSet<i64> = media_club_media.iter().map(|item| item.id).collect();

    Ok(get_favorite_characters(state, payload.user_id, payload.page, &media_id_set).await?)
}

async fn get_favorite_characters(
    state: &AppState,
    user_id: i32,
    page: i32,
    media_id_map: &HashSet<i64>,
) -> Result<FavoritesResponse, MyError> {
    let query = "query($id:Int,$page:Int){User(id:$id){favourites{characters(page:$page){nodes{id,name{full},image{medium},siteUrl,media{nodes{id}}}pageInfo{hasNextPage}}}}}";

    let mut character_list: Vec<CharacterResponse> = Vec::new();
    let response: AniListResponse<CharacterFavs> = state
        .anilist_client
        .post_graphql(
            ANILIST_GRAPHQL_URL,
            query,
            serde_json::json!({"page": page, "id": user_id}),
            None,
        )
        .await?;

    if let Some(errors) = response.errors {
        return Err(MyError::Internal(format!(
            "AniList API error for character favs: {}",
            errors.first().map(|e| e.message.as_str()).unwrap_or("unknown error")
        )));
    }

    let data = response
        .data
        .ok_or_else(|| MyError::Internal("AniList returned no data".into()))?;

    let character_conn = data.user.favourites.characters;

    for character in character_conn.nodes {
        let matching_media: Vec<i32> = character
            .media
            .nodes
            .iter()
            .filter(|m| media_id_map.contains(&(m.id as i64)))
            .map(|m| m.id)
            .collect();

        if !matching_media.is_empty() {
            character_list.push(CharacterResponse {
                id: character.id,
                name: character.name,
                image: character.image,
                site_url: character.site_url,
                media: matching_media,
            });
        }
    }
    let page_info = character_conn
        .page_info
        .ok_or_else(|| MyError::Internal("No page info".to_string()))?;

    Ok(FavoritesResponse {
        characters: character_list,
        has_next_page: page_info.has_next_page,
    })
}
