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
