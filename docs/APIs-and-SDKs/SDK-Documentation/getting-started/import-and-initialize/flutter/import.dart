void main() async{
  final ClientConfig clientConfig = ClientConfig()
    ..setEndpoint("https://your-company.absmartly.io/v1")
    ..setAPIKey("YOUR API KEY")
    ..setApplication("website")
    ..setEnvironment("development");

  final ABSmartlyConfig sdkConfig = ABSmartlyConfig.create()
      .setClient(Client.create(clientConfig));
  final ABSmartly sdk = ABSmartly(sdkConfig);
}
