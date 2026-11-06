absmartly::ContextConfig context_config;
context_config.units = {
    {"session_id", "bf06d8cb5d8137290c4abb64155584fbdb64d8"},
    {"user_id", "123456"}
};

absmartly::ContextData fresh_data = sdk->get_context_data().get();

auto context = sdk->create_context_with(context_config, fresh_data);
