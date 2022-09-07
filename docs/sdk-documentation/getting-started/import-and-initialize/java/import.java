import com.absmartly.sdk.*;

public class Example {
    static public void main(String[] args) {

        final ClientConfig clientConfig = ClientConfig.create()
            .setEndpoint("https://your-company.absmartly.io/v1")
            .setAPIKey("YOUR-API-KEY")
            .setApplication("website") // created in the ABSmartly web console
            .setEnvironment("development");  // created in the ABSmartly web console

        final Client absmartlyClient = Client.create(clientConfig);

        final ABSmartlyConfig sdkConfig = ABSmartlyConfig.create()
            .setClient(absmartlyClient);


        final ABSmartly sdk = ABSmartly.create(sdkConfig);
        // ...
    }
}
