use crate::models::app::AppState;
use crate::routes::auth_routes::{auth_remove_route, auth_sync_route, auth_get_token};
use crate::routes::{
    common_routes::welcome_route,
    media_routes::media_route,
    users_routes::{users_favorites_get_route, users_route},
};
use axum::{routing::get, routing::post, Router};

pub fn create_router(state: AppState) -> Router {
    Router::new()
        .route("/", get(welcome_route))
        .route("/media", get(media_route))
        .route("/users", get(users_route))
        .route("/users/{id}/favorites/{media_id}", get(users_favorites_get_route))
        .route("/auth/sync", post(auth_sync_route))
        .route("/auth/remove", post(auth_remove_route))
        .route("/auth/token", post(auth_get_token))
        .with_state(state)
}
