use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct FavoritesPayload {
    pub user_id: i32,
    pub page: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CharacterResponse {
    pub id: i32,
    pub name: CharacterName,
    pub image: CharacterImage,
    #[serde(rename = "siteUrl")]
    pub site_url: String,
    pub media: Vec<i32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FavoritesResponse {
    pub characters: Vec<CharacterResponse>,
    pub has_next_page: bool,
}

#[derive(Deserialize)]
pub struct AniListResponse<T> {
    pub data: Option<DataWrapper<T>>,
    pub errors: Option<Vec<AniListError>>,
}

#[derive(Deserialize, Debug)]
pub struct AniListError {
    pub message: String,
}

#[derive(Deserialize)]
pub struct DataWrapper<T> {
    #[serde(rename = "User")]
    pub user: UserWrapper<T>,
}

#[derive(Deserialize)]
pub struct UserWrapper<T> {
    pub favourites: T,
}

#[derive(Deserialize)]
pub struct CharacterFavs {
    pub characters: Connection<Character>,
}

#[derive(Deserialize)]

pub struct Connection<T> {
    pub nodes: Vec<T>,
    #[serde(rename = "pageInfo")]
    pub page_info: Option<PageInfo>,
}

#[derive(Deserialize)]
pub struct PageInfo {
    #[serde(rename = "hasNextPage")]
    pub has_next_page: bool,
}

#[derive(Deserialize)]
pub struct MediaNode {
    pub id: i32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CharacterName {
    pub full: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CharacterImage {
    pub medium: Option<String>,
}

#[derive(Deserialize)]
pub struct Character {
    pub id: i32,
    pub name: CharacterName,
    pub image: CharacterImage,
    #[serde(rename = "siteUrl")]
    pub site_url: String,
    pub media: Connection<MediaNode>,
}
