import 'package:absmartly_sdk/absmartly_sdk.dart';

void main() async {
  // Initialize the SDK
  final ClientConfig clientConfig = ClientConfig()
    ..setEndpoint("https://your-company.absmartly.io/v1")
    ..setAPIKey("YOUR-API-KEY")
    ..setApplication("website")
    ..setEnvironment("production");

  final ABSmartly sdk = ABSmartly(
    ABSmartlyConfig.create()
        .setClient(Client.create(clientConfig)),
  );

  // Create a context for this user
  final ContextConfig contextConfig = ContextConfig.create()
      .setUnit("user_id", "user-12345");
  final Context context = await sdk
      .createContext(contextConfig)
      .waitUntilReady();

  // Check which variant the user is in
  final int treatment =
      await context.getTreatment("homepage_banner_experiment");

  if (treatment == 1) {
    // Variant B: show a personalized banner
    showBanner("Welcome back, we have new deals for you!");
  } else {
    // Variant A (control): show the existing banner
    showBanner("Welcome back!");
  }

  // Use a variable set in the Web Console for more flexibility
  final String buttonColor =
      await context.getVariableValue("button.color", "blue");
  setButtonColor(buttonColor);

  // Track when the user completes a key action
  context.track("cta_click", {"page": "homepage"});

  // Track a purchase with revenue data
  context.track("purchase", {
    "revenue": 49.99,
    "item_count": 3,
  });

  // Close the context to flush remaining events
  await context.close();
}
