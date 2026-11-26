class LiquidEventLogger < ContextEventLogger
  def handle_event(event, data)
    case event
    when EVENT_TYPE::EXPOSURE
      Rails.logger.info "ABsmartly exposure: #{data.name}"
    when EVENT_TYPE::GOAL
      Rails.logger.info "ABsmartly goal: #{data.name}"
    when EVENT_TYPE::ERROR
      Rails.logger.error "ABsmartly error: #{data}"
    when EVENT_TYPE::READY
      Rails.logger.info "ABsmartly context ready"
    when EVENT_TYPE::REFRESH
      Rails.logger.info "ABsmartly context refreshed"
    when EVENT_TYPE::PUBLISH
      Rails.logger.info "ABsmartly events published"
    when EVENT_TYPE::CLOSE
      Rails.logger.info "ABsmartly context closed"
    end
  end
end

Absmartly.configure_client do |config|
  config.endpoint = ENV['ABSMARTLY_ENDPOINT']
  config.api_key = ENV['ABSMARTLY_API_KEY']
  config.application = 'my-store'
  config.environment = Rails.env
  config.event_logger = LiquidEventLogger.new
end
