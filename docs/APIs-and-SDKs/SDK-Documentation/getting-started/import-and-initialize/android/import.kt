import com.absmartly.sdk.*

val clientConfig = ClientConfig.create()
    .setEndpoint("https://your-company.absmartly.io/v1")
    .setAPIKey(BuildConfig.ABSMARTLY_API_KEY)
    .setApplication("my-android-app") // created in the ABsmartly Web Console
    .setEnvironment("production") // created in the ABsmartly Web Console

val client = Client.create(clientConfig)

val sdkConfig = ABSmartlyConfig.create()
    .setClient(client)

val sdk = ABSmartly.create(sdkConfig)
