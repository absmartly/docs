import com.absmartly.sdk.*;
import org.conscrypt.Conscrypt;

    // ...
    final ClientConfig clientConfig = ClientConfig.create()
        .setEndpoint("https://your-company.absmartly.io/v1")
        .setAPIKey("YOUR-API-KEY")
        .setApplication("website") // created in the ABSmartly Web Console
        .setEnvironment("development");  // created in the ABSmartly Web Console

    final DefaultHTTPClientConfig httpClientConfig = DefaultHTTPClientConfig.create()
        .setSecurityProvider(Conscrypt.newProvider());

    final DefaultHTTPClient httpClient = DefaultHTTPClient.create(httpClientConfig);

    final Client absmartlyClient = Client.create(clientConfig, httpClient);

    final ABSmartlyConfig sdkConfig = ABSmartlyConfig.create()
        .setClient(absmartlyClient);

    final ABSmartly sdk = ABSmartly.create(sdkConfig);
    // ...
