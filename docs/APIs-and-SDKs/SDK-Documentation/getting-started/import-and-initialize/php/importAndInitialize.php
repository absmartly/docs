use \ABSmartly\SDK\ABsmartly;

$sdk = ABsmartly::createSimple(
  endpoint: 'https://your-company.absmartly.io/v1',
  apiKey: $apiKey,
  application: $application,
  environment: $environment
);
