import com.absmartly.sdk.*
import org.conscrypt.Conscrypt

val httpClientConfig = DefaultHTTPClientConfig.create()
    .setSecurityProvider(Conscrypt.newProvider())

val httpClient = DefaultHTTPClient.create(httpClientConfig)

val client = Client.create(clientConfig, httpClient)
