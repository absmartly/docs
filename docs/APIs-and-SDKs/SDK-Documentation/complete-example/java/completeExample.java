import com.absmartly.sdk.*;
import java.util.Map;

public class ExperimentExample {
    public static void main(String[] args) {
        // Initialize the SDK
        final ClientConfig clientConfig = ClientConfig.create()
            .setEndpoint("https://your-company.absmartly.io/v1")
            .setAPIKey("YOUR-API-KEY")
            .setApplication("website")
            .setEnvironment("production");

        final Client client = Client.create(clientConfig);
        final ABSmartlyConfig config = ABSmartlyConfig.create()
            .setClient(client);
        final ABSmartly sdk = ABSmartly.create(config);

        // Create a context for this user
        final ContextConfig contextConfig = ContextConfig.create()
            .setUnit("user_id", "user-12345");
        try (final Context context = sdk.createContext(contextConfig)
            .waitUntilReady()) {

            // Check which variant the user is in
            if (context.getTreatment("homepage_banner_experiment") == 1) {
                // Variant B: show a personalized banner
                showBanner("Welcome back, we have new deals for you!");
            } else {
                // Variant A (control): show the existing banner
                showBanner("Welcome back!");
            }

            // Use a variable set in the Web Console for more flexibility
            String buttonColor = context.getVariableValue("button.color", "blue");
            setButtonColor(buttonColor);

            // Track when the user completes a key action
            context.track("cta_click", Map.of("page", "homepage"));

            // Track a purchase with revenue data
            context.track("purchase", Map.of(
                "revenue", 49.99,
                "item_count", 3
            ));
        }
    }
}
