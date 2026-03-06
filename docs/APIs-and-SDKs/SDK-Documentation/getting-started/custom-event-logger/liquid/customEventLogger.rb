event_logger = ->(context, event_name, data) {
  case event_name
  when 'exposure'
    Rails.logger.info "ABsmartly exposure: #{data[:name]}"
  when 'goal'
    Rails.logger.info "ABsmartly goal: #{data[:name]}"
  when 'error'
    Rails.logger.error "ABsmartly error: #{data}"
  when 'ready'
    Rails.logger.info "ABsmartly context ready"
  when 'refresh'
    Rails.logger.info "ABsmartly context refreshed"
  when 'publish'
    Rails.logger.info "ABsmartly events published"
  when 'close'
    Rails.logger.info "ABsmartly context closed"
  end
}

sdk = ABSmartly::SDK.new(
  endpoint: ENV['ABSMARTLY_ENDPOINT'],
  api_key: ENV['ABSMARTLY_API_KEY'],
  application: 'my-store',
  environment: Rails.env,
  event_logger: event_logger
)
