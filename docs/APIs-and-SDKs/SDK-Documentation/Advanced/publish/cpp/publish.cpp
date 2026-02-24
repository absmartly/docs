absmartly::PublishEvent event = context.publish();
nlohmann::json event_json = event;
send_to_collector(event_json.dump());
