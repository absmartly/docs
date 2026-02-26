import com.absmartly.sdk.*

val clientConfig = ClientConfig.create()
    .setEndpoint("https://your-company.absmartly.io/v1")
    .setAPIKey(System.getenv("ABSMARTLY_APIKEY"))
    .setApplication(System.getenv("ABSMARTLY_APPLICATION"))
    .setEnvironment(System.getenv("ABSMARTLY_ENVIRONMENT"))

val sdkConfig = ABSmartlyConfig.create()
    .setClient(Client.create(clientConfig))

val sdk = ABsmartly.create(sdkConfig)
