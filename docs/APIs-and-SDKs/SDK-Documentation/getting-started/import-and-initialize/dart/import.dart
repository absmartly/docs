import 'package:absmartly_sdk/absmartly_sdk.dart';

void main() async {
  final sdk = Absmartly.create(
    endpoint: 'https://your-company.absmartly.io/v1',
    apiKey: 'YOUR-API-KEY',
    application: 'website',
    environment: 'development',
  );
}
