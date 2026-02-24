absmartly::ContextConfig config;
config.units = {
    {"session_id", "bf06d8cb5d8137290c4abb64155584fbdb64d8"},
    {"user_id", "123456"}
};

absmartly::ContextData data = nlohmann::json::parse(json_response)
    .get<absmartly::ContextData>();

absmartly::Context context(config, data);
assert(context.is_ready());
