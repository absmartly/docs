import 'package:absmartly_sdk/ab_smartly.dart';
import 'package:absmartly_sdk/absmartly_sdk.dart';
import 'package:absmartly_sdk/client_config.dart';

void main() async {
  final ClientConfig clientConfig = ClientConfig()
    ..setEndpoint("https://your-company.absmartly.io/v1")
    ..setAPIKey("YOUR-API-KEY")
    ..setApplication("website") // created in the ABsmartly Web Console
    ..setEnvironment("development"); // created in the ABsmartly Web Console

  final ABSmartlyConfig sdkConfig = ABSmartlyConfig.create()
      .setClient(Client.create(clientConfig));
  final ABSmartly sdk = ABSmartly(sdkConfig);
}
