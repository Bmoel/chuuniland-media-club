use crate::{
    db::favorites_repo::UserFavoritesRecord,
    errors::MyError,
    models::{app::AppState, favorites::{FavoritesPayload, FavoritesResponse}},
    services::anilist_favorites_service,
};
use std::collections::HashMap;
use tokio::time::{sleep, Duration};

const MAX_RETRIES: u32 = 3;

pub async fn sync_all_user_favorites(state: &AppState) -> Result<usize, MyError> {
    let users = state.users_repository.get_users().await?;
    let user_count = users.len();

    tracing::info!("Syncing favorites for {} users", user_count);

    for user in &users {
        if let Err(e) = sync_user_favorites(state, user.user_id).await {
            tracing::error!(
                user_id = user.user_id,
                error = %e,
                "Failed to sync favorites for user"
            );
        }
    }

    tracing::info!("Favorites sync complete");
    Ok(user_count)
}

const MAX_PAGES: i32 = 25;

async fn sync_user_favorites(state: &AppState, user_id: i64) -> Result<(), MyError> {
    let mut page = 1i32;
    // Map of media_id -> character_ids for that media
    let mut media_character_map: HashMap<i64, Vec<i32>> = HashMap::new();

    loop {
        let result = fetch_page_with_retry(state, user_id, page).await?;

        for character in &result.characters {
            for &media_id in &character.media {
                media_character_map
                    .entry(media_id as i64)
                    .or_default()
                    .push(character.id);
            }
        }

        if !result.has_next_page || page >= MAX_PAGES {
            if page >= MAX_PAGES && result.has_next_page {
                tracing::warn!(user_id, "Reached page limit during favorites sync; some favorites may be skipped");
            }
            break;
        }
        page += 1;
    }

    tracing::info!(
        user_id = user_id,
        media_count = media_character_map.len(),
        "Fetched favorites"
    );

    const MAX_CHARACTERS_PER_MEDIA: usize = 25;

    for (media_id, mut character_ids) in media_character_map {
        character_ids.truncate(MAX_CHARACTERS_PER_MEDIA);
        state
            .favorites_repository
            .upsert_user_favorites(UserFavoritesRecord {
                user_id,
                media_id,
                character_ids,
            })
            .await?;
    }

    Ok(())
}

// Fetches a single page of favorites, retrying up to MAX_RETRIES times if AniList
// returns a 429. On rate limit, sleeps for the duration specified in the response
// header before retrying rather than failing the entire user sync.
async fn fetch_page_with_retry(
    state: &AppState,
    user_id: i64,
    page: i32,
) -> Result<FavoritesResponse, MyError> {
    let mut retries = 0;

    loop {
        let payload = FavoritesPayload {
            user_id: user_id as i32,
            page,
        };

        match anilist_favorites_service::get_user_favorites(state, payload).await {
            Err(MyError::RateLimited(secs)) if retries < MAX_RETRIES => {
                tracing::warn!(
                    seconds = secs,
                    attempt = retries + 1,
                    "Rate limited by AniList, waiting before retry"
                );
                sleep(Duration::from_secs(secs)).await;
                retries += 1;
            }
            other => return other,
        }
    }
}
