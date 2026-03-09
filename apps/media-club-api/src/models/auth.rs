use serde::Deserialize;

#[derive(Deserialize)]
pub struct AuthSyncPayload {
    pub code: String,
}

#[derive(Deserialize)]
pub struct AuthRemovePayload {
    pub code: String,
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
        let json = r#"{"data": {"Viewer": {"id": 42}}}"#;
        let response: ViewerResponse = serde_json::from_str(json).unwrap();
        assert_eq!(response.data.viewer.id, 42);
    }

    #[test]
    fn test_auth_sync_payload_deserialization() {
        let json = r#"{"code": "auth_code_123"}"#;
        let payload: AuthSyncPayload = serde_json::from_str(json).unwrap();
        assert_eq!(payload.code, "auth_code_123");
    }

    #[test]
    fn test_auth_remove_payload_deserialization() {
        let json = r#"{"code": "remove_code_456"}"#;
        let payload: AuthRemovePayload = serde_json::from_str(json).unwrap();
        assert_eq!(payload.code, "remove_code_456");
    }

    #[test]
    fn test_viewer_response_with_large_id() {
        let json = r#"{"data": {"Viewer": {"id": 999999}}}"#;
        let response: ViewerResponse = serde_json::from_str(json).unwrap();
        assert_eq!(response.data.viewer.id, 999999);
    }
}
