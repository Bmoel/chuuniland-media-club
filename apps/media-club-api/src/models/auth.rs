use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct GenericAuthPayload {
    pub code: String,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub access_token: String,
    pub name: String,
    pub avatar_url: String,
}

#[derive(Debug, Deserialize)]
pub struct TokenResponse {
    pub access_token: String,
}

#[derive(Debug, Deserialize)]
pub struct ViewerResponse {
    pub data: ViewerData,
}

#[derive(Debug, Deserialize)]
pub struct ViewerData {
    #[serde(rename = "Viewer")]
    pub viewer: ViewerInfo,
}

#[derive(Debug, Deserialize)]
pub struct ViewerInfo {
    pub id: i32,
    pub name: String,
    pub avatar: ViewerAvatar,
}

#[derive(Debug, Deserialize)]
pub struct ViewerAvatar {
    pub medium: String,
}

#[derive(Debug, Deserialize)]
pub struct ViewerIdResponse {
    pub data: ViewerIdData,
}

#[derive(Debug, Deserialize)]
pub struct ViewerIdData {
    #[serde(rename = "Viewer")]
    pub viewer: ViewerId,
}

#[derive(Debug, Deserialize)]
pub struct ViewerId {
    pub id: i32,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_token_response_deserialization() {
        let json = r#"{"access_token": "abc123"}"#;
        let response: TokenResponse = serde_json::from_str(json).unwrap();
        assert_eq!(response.access_token, "abc123");
    }

    #[test]
    fn test_viewer_response_deserialization() {
        let json = r#"{"data": {"Viewer": {"id": 42, "name": "TestUser", "avatar": {"medium": "https://example.com/avatar.png"}}}}"#;
        let response: ViewerResponse = serde_json::from_str(json).unwrap();
        assert_eq!(response.data.viewer.id, 42);
        assert_eq!(response.data.viewer.name, "TestUser");
        assert_eq!(response.data.viewer.avatar.medium, "https://example.com/avatar.png");
    }

    #[test]
    fn test_auth_sync_payload_deserialization() {
        let json = r#"{"code": "auth_code_123"}"#;
        let payload: GenericAuthPayload = serde_json::from_str(json).unwrap();
        assert_eq!(payload.code, "auth_code_123");
    }

    #[test]
    fn test_auth_remove_payload_deserialization() {
        let json = r#"{"code": "remove_code_456"}"#;
        let payload: GenericAuthPayload = serde_json::from_str(json).unwrap();
        assert_eq!(payload.code, "remove_code_456");
    }

    #[test]
    fn test_viewer_response_with_large_id() {
        let json = r#"{"data": {"Viewer": {"id": 999999, "name": "BigUser", "avatar": {"medium": "https://example.com/big.png"}}}}"#;
        let response: ViewerResponse = serde_json::from_str(json).unwrap();
        assert_eq!(response.data.viewer.id, 999999);
    }

    #[test]
    fn test_viewer_id_response_deserialization() {
        let json = r#"{"data": {"Viewer": {"id": 42}}}"#;
        let response: ViewerIdResponse = serde_json::from_str(json).unwrap();
        assert_eq!(response.data.viewer.id, 42);
    }
}
