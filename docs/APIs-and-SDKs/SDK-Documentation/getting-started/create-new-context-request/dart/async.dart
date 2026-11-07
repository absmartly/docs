final ContextConfig contextConfig = ContextConfig.create()
    .setUnit("session_id", "5ebf06d8cb5d8137290c4abb64155584fbdb64d8");

sdk.createContext(contextConfig).waitUntilReady().then((Context context) {
    print("context ready!");
});
