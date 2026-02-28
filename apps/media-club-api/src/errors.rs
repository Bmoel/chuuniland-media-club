use crate::models::app::{ApiErrorDetail, ApiResponse};
use axum::{
    response::{IntoResponse, Response},
    Json,
};
use lambda_http::http::StatusCode;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum MyError {
    #[error("AniList API error: {0}")]
    Anilist(String),

    #[error("Database failure: {0}")]
    Database(String),

    #[error("Network error: {0}")]
    Network(#[from] reqwest::Error),

    #[error("Internal server error: {0}")]
    Internal(String),

    #[error("Rate Limit error")]
    RateLimited(u64),
}

impl IntoResponse for MyError {
    fn into_response(self) -> Response {
        let (status, response_message, error_log_message) = match self {
            MyError::Anilist(ref msg) => (
                StatusCode::BAD_GATEWAY,
                "Failed to reach out to Anilist".into(),
                msg.clone(),
            ),
            MyError::Database(ref msg) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to reach out to database".into(),
                msg.clone(),
            ),
            MyError::Network(_) => (
                StatusCode::BAD_GATEWAY,
                "Network connection failed".into(),
                "External service unreachable".into(),
            ),
            MyError::Internal(ref msg) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Media Club API failed".into(),
                msg.clone(),
            ),
            MyError::RateLimited(ref time_seconds) => (
                StatusCode::TOO_MANY_REQUESTS,
                format!(
                    "Anilist API Rate Limit hit, please wait {} seconds to retry",
                    time_seconds
                ),
                format!(
                    "Anilist API Rate Limit hit, please wait {} seconds to retry",
                    time_seconds
                ),
            ),
        };

        tracing::error!(
            error_type = %self,
            details = %error_log_message,
            status = %status.as_u16(),
            "Request failed"
        );

        let body = Json(ApiResponse::<()> {
            success: false,
            data: None,
            error: Some(ApiErrorDetail {
                message: response_message,
                code: status.as_u16().to_string(),
            }),
        });

        (status, body).into_response()
    }
}
