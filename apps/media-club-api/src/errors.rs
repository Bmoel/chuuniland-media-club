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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_anilist_error_display() {
        let err = MyError::Anilist("upstream failure".to_string());
        assert_eq!(err.to_string(), "AniList API error: upstream failure");
    }

    #[test]
    fn test_database_error_display() {
        let err = MyError::Database("connection refused".to_string());
        assert_eq!(err.to_string(), "Database failure: connection refused");
    }

    #[test]
    fn test_internal_error_display() {
        let err = MyError::Internal("unexpected state".to_string());
        assert_eq!(err.to_string(), "Internal server error: unexpected state");
    }

    #[test]
    fn test_rate_limited_error_display() {
        let err = MyError::RateLimited(30);
        assert_eq!(err.to_string(), "Rate Limit error");
    }

    #[test]
    fn test_anilist_error_returns_bad_gateway() {
        let err = MyError::Anilist("test".to_string());
        let response = err.into_response();
        assert_eq!(response.status(), StatusCode::BAD_GATEWAY);
    }

    #[test]
    fn test_database_error_returns_internal_server_error() {
        let err = MyError::Database("test".to_string());
        let response = err.into_response();
        assert_eq!(response.status(), StatusCode::INTERNAL_SERVER_ERROR);
    }

    #[test]
    fn test_internal_error_returns_internal_server_error() {
        let err = MyError::Internal("test".to_string());
        let response = err.into_response();
        assert_eq!(response.status(), StatusCode::INTERNAL_SERVER_ERROR);
    }

    #[test]
    fn test_rate_limited_error_returns_too_many_requests() {
        let err = MyError::RateLimited(60);
        let response = err.into_response();
        assert_eq!(response.status(), StatusCode::TOO_MANY_REQUESTS);
    }
}
