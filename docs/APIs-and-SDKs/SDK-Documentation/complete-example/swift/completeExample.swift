import ABSmartly

// Initialize the SDK
let clientConfig = ClientConfig(
    apiKey: "YOUR-API-KEY",
    application: "website",
    endpoint: "https://your-company.absmartly.io/v1",
    environment: "production"
)
let client = try DefaultClient(config: clientConfig)
let sdkConfig = ABSmartlyConfig.create()
sdkConfig.client = client
let sdk = try ABSmartlySDK(config: sdkConfig)

// Create a context for this user
let contextConfig = ContextConfig()
contextConfig.setUnit(unitType: "user_id", uid: "user-12345")
let context = sdk.createContext(config: contextConfig)

context.waitUntilReady().done { context in
    // Check which variant the user is in
    let treatment = context.getTreatment("homepage_banner_experiment")

    if treatment == 1 {
        // Variant B: show a personalized banner
        showBanner("Welcome back, we have new deals for you!")
    } else {
        // Variant A (control): show the existing banner
        showBanner("Welcome back!")
    }

    // Use a variable set in the Web Console for more flexibility
    let buttonColor = context.getVariableValue("button.color", defaultValue: "blue")
    setButtonColor(buttonColor)

    // Track when the user completes a key action
    context.track("cta_click", properties: ["page": "homepage"])

    // Track a purchase with revenue data
    context.track("purchase", properties: [
        "revenue": 49.99,
        "item_count": 3
    ])

    // Close the context when done to flush remaining events
    context.close()
}
