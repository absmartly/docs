    // for all contexts, during SDK initialization
    // when using dependency injection

    builder.Services.AddABSmartly(
        builder.Configuration.GetSection("ABSmartly"),
        HttpClientConfig.CreateDefault(),
        config => config.ContextEventLogger = new CustomEventLogger());

    // or when creating SDK instance manually
    var abSdk = new ABSdk(
        new ABSdkHttpClientFactory(...),
        new ABSmartlyServiceConfiguration {... },
        new ABSdkConfig{ContextEventLogger = new CustomEventLogger()});


    // OR, alternatively, during a particular context initialization
    var contextConfig = new ContextConfig() {
        ContextEventLogger = new CustomEventLogger()
    };
