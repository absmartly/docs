class CustomEventHandler : public absmartly::ContextEventHandler {
public:
    void handle_event(absmartly::Context& context,
                      const std::string& event_type,
                      const nlohmann::json& data) override {
        if (event_type == "exposure") {
            std::cout << "Exposed to experiment: " << data["name"] << std::endl;
        } else if (event_type == "goal") {
            std::cout << "Goal tracked: " << data["name"] << std::endl;
        } else if (event_type == "error") {
            std::cerr << "Error: " << data.dump() << std::endl;
        } else if (event_type == "ready") {
            std::cout << "Context ready" << std::endl;
        } else if (event_type == "refresh") {
            std::cout << "Context refreshed" << std::endl;
        } else if (event_type == "publish") {
            std::cout << "Context published" << std::endl;
        } else if (event_type == "finalize") {
            std::cout << "Context finalized" << std::endl;
        }
    }
};

auto handler = std::make_shared<CustomEventHandler>();

absmartly::SDKConfig sdk_config;
sdk_config.client = client;
sdk_config.context_event_handler = handler;

auto sdk = absmartly::SDK::create(sdk_config);
