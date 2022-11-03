using ABSmartly;
using ABSmartly.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

...

builder.Services.AddABSmartly(builder.Configuration.GetSection("ABSmartly"), HttpClientConfig.CreateDefault());

...
