client_config = ClientConfig.new(
  endpoint: 'https://your-company.absmartly.io/v1',
  api_key: 'YOUR-API-KEY',
  application: 'website',
  environment: 'development')

sdk_config = ABSmartlyConfig.create
sdk_config.client = Client.create(client_config)

sdk = Absmartly.create(sdk_config)
