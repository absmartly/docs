let units = [("session_id", "5ebf06d8cb5d8137290c4abb64155584fbdb64d8")];

let context_data: ContextData = serde_json::from_str(&api_response)?;

let mut context = sdk.create_context_with(units, context_data, None);
assert!(context.is_ready());
