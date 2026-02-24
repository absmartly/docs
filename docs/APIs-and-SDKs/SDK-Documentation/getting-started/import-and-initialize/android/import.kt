import com.absmartly.sdk.*

val clientConfig = ClientConfig.create()
    .setEndpoint("https://your-company.absmartly.io/v1")
    .setAPIKey("YOUR-API-KEY")
    .setApplication("android-app")
    .setEnvironment("production")

val absmartlyClient = Client.create(clientConfig)

val sdkConfig = ABsmartlyConfig.create()
    .setClient(absmartlyClient)

val sdk = ABsmartly.create(sdkConfig)
