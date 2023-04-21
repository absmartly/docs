    var config = new ContextConfig()
        .SetUnit("session_id", "5ebf06d8cb5d8137290c4abb64155584fbdb64d8");
    var context = await _abSdk.CreateContextAsync(config);

    var anotherContextConfig = new ContextConfig()
        .SetUnit("session_id", "5ebf06d8cb5d8137290c4abb64155584fbdb64d9"); // a unique id identifying the other user

    var anotherContext = _abSdk.CreateContextWith(anotherContextConfig, context.GetContextData());
