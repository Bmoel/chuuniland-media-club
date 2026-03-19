use crate::errors::MyError;
use crate::models::users::User;
use crate::models::users::UsersRepository;
use async_trait::async_trait;
use aws_sdk_dynamodb::{error::SdkError, types::AttributeValue, Client};
use std::sync::Arc;

pub(crate) struct UsersRepo {
    client: Arc<Client>,
    table_name: String,
}

impl UsersRepo {
    pub fn new(client_state: Arc<Client>, table_name: String) -> Self {
        Self {
            client: client_state,
            table_name,
        }
    }
}

#[async_trait]
impl UsersRepository for UsersRepo {
    async fn get_users(&self) -> Result<Vec<User>, MyError> {
        // NOTE: DynamoDB scan reads at most 1MB per request. This is fine for a small
        // media club membership, but would need pagination for larger datasets.
        let result = self
            .client
            .scan()
            .table_name(&self.table_name)
            .send()
            .await
            .map_err(|e| MyError::Database(format!("DynamoDB Scan Error: {}", e)))?;

        let items: Vec<User> = serde_dynamo::from_items(result.items.unwrap_or_default())
            .map_err(|e| MyError::Internal(format!("Serialization error: {}", e)))?;

        Ok(items)
    }

    async fn add_user(&self, user_id: &i32) -> Result<(), MyError> {
        let item = serde_json::json!({
            "user_id": user_id,
            "created_at": chrono::Utc::now().to_rfc3339(),
        });

        let item_attributes = serde_dynamo::to_item(item)
            .map_err(|e| MyError::Internal(format!("Serialization error: {}", e)))?;

        self.client
            .put_item()
            .table_name(&self.table_name)
            .set_item(Some(item_attributes))
            .condition_expression("attribute_not_exists(user_id)")
            .send()
            .await
            .map_err(|e| {
                if let SdkError::ServiceError(service_error) = &e {
                    if service_error.err().is_conditional_check_failed_exception() {
                        return MyError::Conflict("User already exists".into());
                    }
                }
                MyError::Database(format!("DynamoDB PutItem Error: {}", e))
            })?;

        Ok(())
    }

    async fn remove_user(&self, user_id: &i32) -> Result<(), MyError> {
        self.client
            .delete_item()
            .table_name(&self.table_name)
            .key("user_id", AttributeValue::N(user_id.to_string()))
            .condition_expression("attribute_exists(user_id)")
            .send()
            .await
            .map_err(|e| {
                if let SdkError::ServiceError(service_error) = &e {
                    if service_error.err().is_conditional_check_failed_exception() {
                        return MyError::NotFound("User does not exist".into());
                    }
                }
                MyError::Database(format!("DynamoDB DeleteItem Error: {}", e))
            })?;

        Ok(())
    }
}
