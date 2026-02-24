absmartly::ContextData fresh_data = nlohmann::json::parse(fresh_json_response)
    .get<absmartly::ContextData>();

context.refresh(fresh_data);
