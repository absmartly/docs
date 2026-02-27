use absmartly_sdk::ContextOptions;

let units = [("session_id", "5ebf06d8cb5d8137290c4abb64155584fbdb64d8")];

let context_data: ContextData = serde_json::from_str(&api_response)?;

let options = ContextOptions {
    publish_delay: 100,
    refresh_period: 0,
    event_logger: None,
};

let mut context = sdk.create_context_with(units, context_data, Some(options));
assert!(context.is_ready());
