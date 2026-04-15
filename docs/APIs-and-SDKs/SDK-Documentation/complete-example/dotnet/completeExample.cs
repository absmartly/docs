using ABSmartly;
using Microsoft.Extensions.DependencyInjection;

// Initialize the SDK
var serviceProvider = new ServiceCollection()
    .AddHttpClient()
    .BuildServiceProvider();

var httpClientFactory = serviceProvider
    .GetService<IHttpClientFactory>();

var abSdk = new ABSdk(
    new ABSdkHttpClientFactory(httpClientFactory),
    new ABSmartlyServiceConfiguration
    {
        Environment = "production",
        Application = "website",
        Endpoint = "https://your-company.absmartly.io/v1",
        ApiKey = "YOUR-API-KEY"
    });

// Create a context for this user
var config = new ContextConfig()
    .SetUnit("user_id", "user-12345");

// Using the disposable pattern ensures events are flushed on close
using var context = abSdk.CreateContext(config);
await context.WaitUntilReady();

// Check which variant the user is in
if (context.GetTreatment("homepage_banner_experiment") == 0)
{
    // Variant A (control): show the existing banner
    ShowBanner("Welcome back!");
}
else
{
    // Variant B: show a personalized banner
    ShowBanner("Welcome back, we have new deals for you!");
}

// Use a variable set in the Web Console for more flexibility
var buttonColor = context.GetVariableValue("button.color", "blue");
SetButtonColor(buttonColor);

// Track when the user completes a key action
context.Track("cta_click", new Dictionary<string, object>
{
    { "page", "homepage" }
});

// Track a purchase with revenue data
context.Track("purchase", new Dictionary<string, object>
{
    { "revenue", 49.99 },
    { "item_count", 3 }
});
// Context is automatically closed and flushed by the using statement
