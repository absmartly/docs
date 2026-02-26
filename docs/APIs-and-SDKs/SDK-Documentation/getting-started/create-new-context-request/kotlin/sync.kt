val contextConfig = ContextConfig.create()
    .setUnit("session_id", "bf06d8cb5d8137290c4abb64155584fbdb64d8")
    .setUnit("user_id", "123456")

val context = sdk.createContext(contextConfig)
    .waitUntilReady()
