// fetch fresh context data from the ABsmartly collector API
let fresh_data: ContextData = serde_json::from_str(&api_response)?;

context.refresh(fresh_data);
