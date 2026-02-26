#include <absmartly/sdk.h>
#include <absmartly/sdk_config.h>
#include <absmartly/client.h>
#include <absmartly/client_config.h>
#include <absmartly/context_config.h>
#include <absmartly/default_http_client.h>
#include <memory>

int main() {
    absmartly::ClientConfig client_config;
    client_config.endpoint = "https://your-company.absmartly.io/v1";
    client_config.api_key = "YOUR-API-KEY";
    client_config.application = "website";
    client_config.environment = "production";

    auto http_client = std::make_shared<absmartly::DefaultHTTPClient>();
    auto client = std::make_shared<absmartly::Client>(client_config, http_client);

    absmartly::SDKConfig sdk_config;
    sdk_config.client = client;

    auto sdk = absmartly::SDK::create(sdk_config);

    absmartly::ContextConfig context_config;
    context_config.units = {{"session_id", "5ebf06d8cb5d8137290c4abb64155584fbdb64d8"}};

    auto context = sdk->create_context(context_config);
    context->wait_until_ready();
}
