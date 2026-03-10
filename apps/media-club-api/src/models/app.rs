use crate::{
    db::favorites_repo::FavoritesRepository,
    models::{media::MediaRepository, users::UsersRepository},
    services::throttled_client::ThrottledClient,
};
use axum::{
    http::{header, StatusCode},
    response::{IntoResponse, Response},
};
use serde::Serialize;
use std::sync::Arc;

#[derive(Clone)]
pub struct EnvironmentVariables {
    pub media_table_name: String,
    pub users_table_name: String,
    pub favorites_table_name: String,
    pub client_id: String,
    pub client_secret: String,
    pub redirect_uri: String,
}

#[derive(Clone)]
pub struct AppState {
    pub media_repository: Arc<dyn MediaRepository + Send + Sync>,
    pub users_repository: Arc<dyn UsersRepository + Send + Sync>,
    pub favorites_repository: Arc<dyn FavoritesRepository + Send + Sync>,
    pub anilist_client: Arc<ThrottledClient>,
    pub environment_variables: EnvironmentVariables,
}

#[derive(Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<ApiErrorDetail>,
}

#[derive(Serialize)]
pub struct ApiErrorDetail {
    pub message: String,
    pub code: String,
}

impl<T> IntoResponse for ApiResponse<T>
where
    T: Serialize,
{
    fn into_response(self) -> Response {
        let status = if self.success {
            StatusCode::OK
        } else {
            StatusCode::BAD_REQUEST
        };

        match serde_json::to_string(&self) {
            Ok(json) => Response::builder()
                .status(status)
                .header(header::CONTENT_TYPE, "application/json")
                .body(axum::body::Body::from(json))
                .unwrap_or_else(|_| StatusCode::INTERNAL_SERVER_ERROR.into_response()),
            Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_api_response_success_serialization() {
        let response = ApiResponse {
            success: true,
            data: Some("hello"),
            error: None,
        };
        let json = serde_json::to_string(&response).unwrap();
        let parsed: serde_json::Value = serde_json::from_str(&json).unwrap();
        assert_eq!(parsed["success"], true);
        assert_eq!(parsed["data"], "hello");
        assert!(parsed["error"].is_null());
    }

    #[test]
    fn test_api_response_error_serialization() {
        let response: ApiResponse<()> = ApiResponse {
            success: false,
            data: None,
            error: Some(ApiErrorDetail {
                message: "Something went wrong".to_string(),
                code: "500".to_string(),
            }),
        };
        let json = serde_json::to_string(&response).unwrap();
        let parsed: serde_json::Value = serde_json::from_str(&json).unwrap();
        assert_eq!(parsed["success"], false);
        assert!(parsed["data"].is_null());
        assert_eq!(parsed["error"]["message"], "Something went wrong");
        assert_eq!(parsed["error"]["code"], "500");
    }

    #[test]
    fn test_api_response_success_with_no_data() {
        let response: ApiResponse<()> = ApiResponse {
            success: true,
            data: None,
            error: None,
        };
        let json = serde_json::to_string(&response).unwrap();
        let parsed: serde_json::Value = serde_json::from_str(&json).unwrap();
        assert_eq!(parsed["success"], true);
        assert!(parsed["data"].is_null());
        assert!(parsed["error"].is_null());
    }

    #[test]
    fn test_api_response_with_numeric_data() {
        let response = ApiResponse {
            success: true,
            data: Some(42u32),
            error: None,
        };
        let json = serde_json::to_string(&response).unwrap();
        let parsed: serde_json::Value = serde_json::from_str(&json).unwrap();
        assert_eq!(parsed["data"], 42);
    }
}
