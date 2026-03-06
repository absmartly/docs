class CustomEventLogger : ContextEventLogger {
    override fun handleEvent(context: Context, event: ContextEventLogger.EventType, data: Any?) {
        when (event) {
            ContextEventLogger.EventType.Exposure -> {
                val exposure = data as Exposure
                println("exposed to experiment ${exposure.name}")
            }
            ContextEventLogger.EventType.Goal -> {
                val goal = data as GoalAchievement
                println("goal tracked: ${goal.name}")
            }
            ContextEventLogger.EventType.Error -> {
                println("error: $data")
            }
            ContextEventLogger.EventType.Publish,
            ContextEventLogger.EventType.Ready,
            ContextEventLogger.EventType.Refresh,
            ContextEventLogger.EventType.Close -> {}
        }
    }
}

val sdkConfig = ABsmartlyConfig.create()
sdkConfig.setContextEventLogger(CustomEventLogger())

val contextConfig = ContextConfig.create()
contextConfig.setEventLogger(CustomEventLogger())
