from absmartly import ClientConfig, Client, DefaultHTTPClient, DefaultHTTPClientConfig, ABSmartlyConfig, ABSmartly, ContextConfig

# Initialize the SDK
client_config = ClientConfig()
client_config.endpoint = "https://your-company.absmartly.io/v1"
client_config.api_key = "YOUR-API-KEY"
client_config.application = "website"
client_config.environment = "production"

sdk_config = ABSmartlyConfig()
sdk_config.client = Client(client_config, DefaultHTTPClient(DefaultHTTPClientConfig()))
sdk = ABSmartly(sdk_config)

# Create a context for this user
context_config = ContextConfig()
context_config.units = {"user_id": "user-12345"}
context = sdk.create_context(context_config)
context.wait_until_ready()

# Check which variant the user is in
treatment = context.get_treatment("homepage_banner_experiment")

if treatment == 0:
    # Variant A (control): show the existing banner
    show_banner("Welcome back!")
elif treatment == 1:
    # Variant B: show a personalized banner
    show_banner("Welcome back, we have new deals for you!")

# Use a variable set in the Web Console for more flexibility
button_color = context.get_variable_value("button.color", "blue")
set_button_color(button_color)

# Track when the user completes a key action
context.track("cta_click", {"page": "homepage"})

# Track a purchase with revenue data
context.track("purchase", {
    "revenue": 49.99,
    "item_count": 3,
})

# Close the context to flush remaining events
context.close()
