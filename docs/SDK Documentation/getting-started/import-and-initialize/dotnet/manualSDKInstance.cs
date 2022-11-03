using ABSmartly;
using ABSmartly.Services;
using Microsoft.Extensions.DependencyInjection;

var serviceProvider = new ServiceCollection().AddHttpClient().BuildServiceProvider();
var httpClientFactory = serviceProvider.GetService<IHttpClientFactory>();

var abSdk = new ABSdk(new ABSdkHttpClientFactory(httpClientFactory), new ABSmartlyServiceConfiguration
{
    Environment = "development",
    Application = "website",
    Endpoint = "https://your-company.absmartly.io/v1",
    ApiKey = "YOUR-API-KEY"
});

...
