use serde_json::json;

context.track("payment", json!({
    "item_count": 1,
    "total_amount": 1999.99
}))?;
