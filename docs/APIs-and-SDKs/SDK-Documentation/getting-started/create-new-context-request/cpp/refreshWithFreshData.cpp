absmartly::ContextConfig config;
config.units = {
    {"session_id", "bf06d8cb5d8137290c4abb64155584fbdb64d8"},
    {"user_id", "123456"}
};
config.refresh_period = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

absmartly::Context context(config, data);
