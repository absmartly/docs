absmartly::ContextConfig context_config;
context_config.units = {
    {"session_id", "bf06d8cb5d8137290c4abb64155584fbdb64d8"},
    {"user_id", "123456"}
};

auto context = sdk->create_context(context_config);

// context is not yet ready; call wait_until_ready() before using it
context->wait_until_ready();
