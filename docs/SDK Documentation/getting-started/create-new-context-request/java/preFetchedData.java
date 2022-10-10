final ContextConfig contextConfig = ContextConfig.create()
    .setUnit("session_id", "5ebf06d8cb5d8137290c4abb64155584fbdb64d8"); // a unique id identifying the user

final Context context = sdk.createContext(contextConfig)
    .waitUntilReady();

final ContextConfig anotherContextConfig = ContextConfig.create()
    .setUnit("session_id", "5ebf06d8cb5d8137290c4abb64155584fbdb64d8"); // a unique id identifying the other user

final Context anotherContext = sdk.createContextWith(anotherContextConfig, context.getData());

assert(anotherContext.isReady()); // no need to wait
