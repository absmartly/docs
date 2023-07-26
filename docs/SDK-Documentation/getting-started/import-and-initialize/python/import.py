def main():
    client_config = ClientConfig()
    client_config.endpoint = "https://sandbox.test.io/v1"
    client_config.api_key = "test"
    client_config.application = "www"
    client_config.environment = "prod"

    default_client_config = DefaultHTTPClientConfig()
    default_client = DefaultHTTPClient(default_client_config)
    sdk_config = ABSmartlyConfig()
    sdk_config.client = Client(client_config, default_client)
    sdk = ABSmartly(sdk_config)

    context_config = ContextConfig()
    ctx = sdk.create_context(context_config)
