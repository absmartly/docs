use \ABSmartly\SDK\SDK;

$sdk = SDK::createWithDefaults(
  endpoint: 'https://your-company.absmartly.io/v1',
  apiKey: $apiKey,
  environment: $environment,
  application: $application
);
