    // example implementation
    public class CustomEventLogger : IContextEventLogger
    {
        public void HandleEvent(Context context, EventType eventType, object data)
        {
            switch (eventType)
            {
                case EventType.Exposure when data is Exposure exposure:
                    Console.WriteLine($"exposed to experiment: {exposure.Name}");
                    break;
                case EventType.Goal when data is GoalAchievement goal:
                    Console.WriteLine($"goal tracked: {goal.Name}");
                    break;
                case EventType.Error:
                    Console.WriteLine($"error: {data}");
                    break;
                case EventType.Close:
                case EventType.Publish:
                case EventType.Ready:
                case EventType.Refresh:
                    break;
            }
        }
    }
