use crate::errors::MyError;
use governor::{DefaultDirectRateLimiter, Jitter};
use std::sync::Arc;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

#[derive(Clone)]
pub struct ThrottledClient {
    client: reqwest::Client,
    limiter: Arc<DefaultDirectRateLimiter>,
}

impl ThrottledClient {
    pub fn new(client: reqwest::Client, limiter: Arc<DefaultDirectRateLimiter>) -> Self {
        Self { client, limiter }
    }

    /// For OAuth exchanges: sends a flat JSON payload
    pub async fn post_raw_json<T, P>(&self, url: &str, payload: P) -> Result<T, MyError>
    where
        T: serde::de::DeserializeOwned,
        P: serde::Serialize,
    {
        let jitter = Jitter::new(Duration::from_millis(100), Duration::from_millis(400));
        self.limiter.until_ready_with_jitter(jitter).await;

        let res = self
            .client
            .post(url)
            .json(&payload)
            .send()
            .await
            .map_err(|_| MyError::Anilist("Failed to recieve anilist response".to_string()))?;

        res.json::<T>()
            .await
            .map_err(|e| MyError::Internal(format!("Parse error: {}", e)))
    }

    /// For GraphQL: wraps query/vars and supports an optional Bearer token
    pub async fn post_graphql<T, V>(
        &self,
        url: &str,
        query: &str,
        variables: V,
        token: Option<&str>,
    ) -> Result<T, MyError>
    where
        T: serde::de::DeserializeOwned,
        V: serde::Serialize,
    {
        let jitter = Jitter::new(Duration::from_millis(100), Duration::from_millis(400));
        self.limiter.until_ready_with_jitter(jitter).await;

        let payload = serde_json::json!({
            "query": query,
            "variables": variables,
        });

        let mut rb = self.client.post(url).json(&payload);

        if let Some(t) = token {
            rb = rb.bearer_auth(t);
        }

        let res = rb
            .send()
            .await
            .map_err(|_| MyError::Anilist("Failed to recieve anilist response".to_string()))?;

        if res.status() == reqwest::StatusCode::TOO_MANY_REQUESTS {
            let headers = res.headers();

            let now = SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .map(|d| d.as_secs())
                .unwrap_or(0);

            let reset_timestamp = headers
                .get("x-ratelimit-reset")
                .and_then(|h| h.to_str().ok())
                .and_then(|s| s.parse::<u64>().ok());

            let seconds_to_wait = match reset_timestamp {
                Some(reset_at) if reset_at > now => reset_at - now,
                Some(_) => 1,
                None => 60,
            };

            return Err(MyError::RateLimited(seconds_to_wait));
        }

        // Handle other non-success status codes
        if !res.status().is_success() {
            return Err(MyError::Anilist(format!(
                "API returned error status: {}",
                res.status()
            )));
        }

        res.json::<T>()
            .await
            .map_err(|e| MyError::Internal(format!("Parse error: {}", e)))
    }
}
