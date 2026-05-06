require "absmartly"

# Initialize the SDK
Absmartly.configure_client do |config|
  config.endpoint = "https://your-company.absmartly.io/v1"
  config.api_key = "YOUR-API-KEY"
  config.application = "website"
  config.environment = "production"
end

# Create a context for this user
context_config = Absmartly.create_context_config
context_config.units = { user_id: "user-12345" }
context = Absmartly.create_context(context_config)
context.wait_until_ready

# Check which variant the user is in
treatment = context.treatment("homepage_banner_experiment")

if treatment == 1
  # Variant B: show a personalized banner
  show_banner("Welcome back, we have new deals for you!")
else
  # Variant A (control): show the existing banner
  show_banner("Welcome back!")
end

# Use a variable set in the Web Console for more flexibility
button_color = context.variable_value("button.color", "blue")
set_button_color(button_color)

# Track when the user completes a key action
context.track("cta_click", { page: "homepage" })

# Track a purchase with revenue data
context.track("purchase", {
  revenue: 49.99,
  item_count: 3,
})

# Close the context to flush remaining events
context.close
