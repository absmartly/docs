void main() async {
  final sdk = ABsmartly.create(
    endpoint: 'https://your-company.absmartly.io/v1',
    apiKey: 'YOUR-API-KEY',
    application: 'website',
    environment: 'development',
  );
}
