use crate::errors::MyError;
use async_trait::async_trait;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub user_id: i64,
    pub created_at: String,
}

#[async_trait]
pub trait UsersRepository: Send + Sync {
    async fn get_users(&self) -> Result<Vec<User>, MyError>;
    async fn add_user(&self, user_id: &i32) -> Result<(), MyError>;
    async fn remove_user(&self, user_id: &i32) -> Result<(), MyError>;
}
