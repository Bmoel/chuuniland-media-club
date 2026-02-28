pub mod anilist_auth_service;
pub mod anilist_favorites_service;
pub mod auth_service;
// favorites_sync_service is only used by the favorites_job binary (src/bin/favorites_job.rs),
// not by the main HTTP API binary. dead_code is suppressed here to avoid false warnings from
// the main binary's compilation, since each binary target is compiled independently.
#[allow(dead_code)]
pub mod favorites_sync_service;
pub mod throttled_client;
