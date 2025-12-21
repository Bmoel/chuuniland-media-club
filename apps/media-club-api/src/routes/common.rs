use axum::{
    body::Body,
    http::{header, StatusCode},
    response::Response,
};
use serde_json::{json, Value};

pub async fn welcome_route() -> Response {
    Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from("Welcome to media-club-api!"))
        .unwrap()
}

pub async fn default_route() -> Response {
    let data: Value = json!({
        "error": {
            "code": "invalid_route",
            "message": "Route does not exist"
        }
    });

    Response::builder()
        .status(StatusCode::NOT_FOUND)
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(data.to_string()))
        .unwrap()
}
