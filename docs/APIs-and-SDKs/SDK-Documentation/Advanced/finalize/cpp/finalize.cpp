absmartly::PublishEvent event = context.finalize();
send_to_collector(nlohmann::json(event).dump());
