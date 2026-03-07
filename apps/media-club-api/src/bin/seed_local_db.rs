use aws_sdk_dynamodb::types::{
    AttributeDefinition, AttributeValue, KeySchemaElement, KeyType, ScalarAttributeType,
};
use std::collections::HashMap;
use std::env;
use std::env::var;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();
    let media_table_name = var("DB_NAME_MEDIA").map_err(|_| "media table name not found")?;
    let users_table_name = var("DB_NAME_USERS").map_err(|_| "users table name not found")?;
    let favorites_table_name =
        var("DB_NAME_FAVORITES").map_err(|_| "favorites table name not found")?;
    let media_table_pri_key =
        var("DB_NAME_MEDIA_PRI_KEY").map_err(|_| "media table pri key not found")?;
    let users_table_pri_key =
        var("DB_NAME_USERS_PRI_KEY").map_err(|_| "users table pri key not found")?;
    let favorites_table_pri_key =
        var("DB_NAME_FAVORITES_PRI_KEY").map_err(|_| "favorites table pri key not found")?;
    let favorites_sort_key =
        var("DB_NAME_FAVORITES_SORT_KEY").map_err(|_| "favorites sort key not found")?;

    let args: Vec<String> = env::args().collect();
    let table_map = HashMap::from([
        (
            media_table_name.clone(),
            "./snapshots/media_snapshot.json".to_string(),
        ),
        (
            users_table_name.clone(),
            "./snapshots/users_snapshot.json".to_string(),
        ),
        (
            favorites_table_name.clone(),
            "./snapshots/favorites_snapshot.json".to_string(),
        ),
    ]);
    let primary_key_map = HashMap::from([
        (media_table_name.clone(), media_table_pri_key.to_string()),
        (users_table_name.clone(), users_table_pri_key.to_string()),
        (
            favorites_table_name.clone(),
            favorites_table_pri_key.to_string(),
        ),
    ]);
    // Tables with a sort key use drop-and-recreate instead of item-by-item deletion
    let sort_key_map: HashMap<String, Option<String>> = HashMap::from([
        (media_table_name.clone(), None),
        (users_table_name.clone(), None),
        (favorites_table_name.clone(), Some(favorites_sort_key)),
    ]);
    let primary_key_type_map = HashMap::from([
        (media_table_name.clone(), ScalarAttributeType::N),
        (users_table_name.clone(), ScalarAttributeType::N),
        (favorites_table_name.clone(), ScalarAttributeType::N),
    ]);

    let config = aws_config::from_env()
        .endpoint_url("http://localhost:8000")
        .load()
        .await;
    let client = aws_sdk_dynamodb::Client::new(&config);

    // No args → seed all tables; otherwise seed only the ones specified
    let all_tables: Vec<String> = table_map.keys().cloned().collect();
    let table_names: Vec<&str> = if args.len() < 2 {
        all_tables.iter().map(|s| s.as_str()).collect()
    } else {
        let requested = &args[1..];
        for table_name in requested {
            if !table_map.contains_key(table_name) {
                eprintln!("Error: '{}' is not a valid table name", table_name);
                std::process::exit(1);
            }
        }
        requested.iter().map(|s| s.as_str()).collect()
    };

    for table_name in table_names {
        seed_table(
            &client,
            table_name,
            &table_map,
            &primary_key_map,
            &sort_key_map,
            &primary_key_type_map,
        )
        .await?;
    }

    Ok(())
}

async fn seed_table(
    client: &aws_sdk_dynamodb::Client,
    table_name: &str,
    table_map: &HashMap<String, String>,
    primary_key_map: &HashMap<String, String>,
    sort_key_map: &HashMap<String, Option<String>>,
    primary_key_type_map: &HashMap<String, ScalarAttributeType>,
) -> Result<(), Box<dyn std::error::Error>> {
    let current_tables = client.list_tables().send().await?;
    let table_exists = current_tables
        .table_names()
        .contains(&table_name.to_string());

    let primary_key = primary_key_map
        .get(table_name)
        .expect("primary key does not exist");
    let sort_key = sort_key_map
        .get(table_name)
        .expect("sort key entry does not exist");

    // Tables with a composite key are dropped and recreated to avoid the complexity of
    // deleting items by both partition + sort key. For simple single-key tables, clear
    // items individually.
    if table_exists && sort_key.is_some() {
        println!(
            "Table {} found (composite key). Dropping and recreating...",
            table_name
        );
        client
            .delete_table()
            .table_name(table_name)
            .send()
            .await
            .expect("failed to delete table");
    } else if table_exists {
        println!("Table {} found. Clearing values...", table_name);
        let items = client.scan().table_name(table_name).send().await?;

        for item in items.items.unwrap_or_default() {
            let id = item.get(primary_key).unwrap();

            client
                .delete_item()
                .table_name(table_name)
                .key(primary_key, id.clone())
                .send()
                .await?;
        }
    }

    if !table_exists || sort_key.is_some() {
        println!("Table {} not found. Creating...", table_name);
        let primary_key_type = primary_key_type_map
            .get(table_name)
            .expect("primary key type not found")
            .clone();

        let mut create_req = client
            .create_table()
            .table_name(table_name)
            .attribute_definitions(
                AttributeDefinition::builder()
                    .attribute_name(primary_key)
                    .attribute_type(primary_key_type.clone())
                    .build()?,
            )
            .key_schema(
                KeySchemaElement::builder()
                    .attribute_name(primary_key)
                    .key_type(KeyType::Hash)
                    .build()?,
            )
            .billing_mode(aws_sdk_dynamodb::types::BillingMode::PayPerRequest);

        if let Some(sk) = sort_key {
            create_req = create_req
                .attribute_definitions(
                    AttributeDefinition::builder()
                        .attribute_name(sk)
                        .attribute_type(primary_key_type)
                        .build()?,
                )
                .key_schema(
                    KeySchemaElement::builder()
                        .attribute_name(sk)
                        .key_type(KeyType::Range)
                        .build()?,
                );
        }

        create_req
            .send()
            .await
            .expect("failed to create table");
    }

    let file_path = table_map
        .get(table_name)
        .expect("Table mapping was invalid");
    let json_data = std::fs::read_to_string(file_path)?;
    let raw_json: serde_json::Value = serde_json::from_str(&json_data)?;

    if let Some(items) = raw_json.get("Items").and_then(|v| v.as_array()) {
        for item_value in items {
            let mut item_map = HashMap::new();
            if let Some(obj) = item_value.as_object() {
                for (key, val) in obj {
                    item_map.insert(key.clone(), json_to_attribute_value(val));
                }
            }
            client
                .put_item()
                .table_name(table_name)
                .set_item(Some(item_map))
                .send()
                .await?;
        }
    }

    println!("✅ Successfully seeded table '{}'", table_name);
    Ok(())
}

fn json_to_attribute_value(val: &serde_json::Value) -> AttributeValue {
    if let Some(obj) = val.as_object() {
        if let Some(s) = obj.get("S").and_then(|v| v.as_str()) {
            return AttributeValue::S(s.to_string());
        }
        if let Some(n) = obj.get("N").and_then(|v| v.as_str()) {
            return AttributeValue::N(n.to_string());
        }
        if let Some(ns) = obj.get("NS").and_then(|v| v.as_array()) {
            let values: Vec<String> = ns
                .iter()
                .filter_map(|v| v.as_str().map(|s| s.to_string()))
                .collect();
            return AttributeValue::Ns(values);
        }
    }
    AttributeValue::Null(true)
}