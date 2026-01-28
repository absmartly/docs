void main() async {
  // Recommended: Simple API
  final sdk = ABSmartly.create(
    endpoint: 'https://your-company.absmartly.io/v1',
    apiKey: 'YOUR-API-KEY',
    application: 'website',
    environment: 'development',
  );
}
