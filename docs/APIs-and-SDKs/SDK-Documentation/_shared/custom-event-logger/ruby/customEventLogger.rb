class CustomEventLogger < ContextEventLogger
  def handle_event(event, data)
    case event
    when EVENT_TYPE::EXPOSURE
      puts "Exposure: #{data}"
    when EVENT_TYPE::GOAL
      puts "Goal: #{data}"
    when EVENT_TYPE::ERROR
      puts "Error: #{data}"
    when EVENT_TYPE::PUBLISH
      puts "Publish: #{data}"
    when EVENT_TYPE::READY
      puts "Ready: #{data}"
    when EVENT_TYPE::REFRESH
      puts "Refresh: #{data}"
    when EVENT_TYPE::CLOSE
      puts "Close"
    end
  end
end

# For all contexts, during SDK initialization
Absmartly.configure_client do |config|
  config.endpoint = "https://your-company.absmartly.io/v1"
  config.api_key = "YOUR-API-KEY"
  config.application = "website"
  config.environment = "production"
  config.event_logger = CustomEventLogger.new
end

# OR, for a particular context
context_config = Absmartly.create_context_config
context_config.set_event_logger(CustomEventLogger.new)
