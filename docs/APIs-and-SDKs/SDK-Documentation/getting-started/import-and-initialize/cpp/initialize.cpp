#include <absmartly/context.h>
#include <absmartly/context_config.h>
#include <absmartly/models.h>
#include <nlohmann/json.hpp>

int main() {
    std::string json_response = fetch_context_data();

    absmartly::ContextData data = nlohmann::json::parse(json_response)
        .get<absmartly::ContextData>();

    absmartly::ContextConfig config;
    config.units = {{"session_id", "5ebf06d8cb5d8137290c4abb64155584fbdb64d8"}};

    absmartly::Context context(config, data);
}
