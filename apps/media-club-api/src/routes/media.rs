use axum::{
    body::Body,
    http::{header, StatusCode},
    response::Response,
};
use serde_json::{json, Value};

pub async fn media_route() -> Response {
    let media: Value = json!({}); //TODO: Get media from db

    Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(media.to_string()))
        .unwrap()
}
