class CustomEventLogger implements ContextEventLogger {
  @override
  void handleEvent(Context context, EventType event, dynamic data) {
    switch (event) {
      case EventType.exposure:
        final Exposure exposure = data;
        print("exposed to experiment ${exposure.name}");
        break;
      case EventType.goal:
        final GoalAchievement goal = data;
        print("goal tracked: ${goal.name}");
        break;
      case EventType.error:
        print("error: $data");
        break;
      case EventType.publish:
      case EventType.ready:
      case EventType.refresh:
      case EventType.close:
        break;
    }
  }
}
