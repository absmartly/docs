class CustomEventLogger : ContextEventLogger {
    override fun handleEvent(context: Context, type: ContextEventLogger.EventType, data: Any?) {
        when (type) {
            ContextEventLogger.EventType.Exposure -> {
                val exposure = data as Exposure
                println("Exposed to experiment: ${exposure.name}")
            }
            ContextEventLogger.EventType.Goal -> {
                val goal = data as GoalAchievement
                println("Goal tracked: ${goal.name}")
            }
            ContextEventLogger.EventType.Error -> {
                println("Error: $data")
            }
            ContextEventLogger.EventType.Publish -> {
                val event = data as PublishEvent
                println("Published ${event.exposures?.size ?: 0} exposures")
            }
            ContextEventLogger.EventType.Ready,
            ContextEventLogger.EventType.Refresh,
            ContextEventLogger.EventType.Close -> {}
        }
    }
}
