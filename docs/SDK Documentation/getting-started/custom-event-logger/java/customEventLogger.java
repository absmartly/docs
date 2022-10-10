    // example implementation
    public class CustomEventLogger implements ContextEventLogger {
        @Override
        public void handleEvent(Context context, ContextEventLogger.EventType event, Object data) {
            switch (event) {
            case Exposure:
                final Exposure exposure = (Exposure)data;
                System.out.printf("exposed to experiment %s", exposure.name);
                break;
            case Goal:
                final GoalAchievement goal = (GoalAchievement)data;
                System.out.printf("goal tracked: %s", goal.name);
                break;
            case Error:
                System.out.printf("error: %s", data);
                break;
            case Publish:
            case Ready:
            case Refresh:
            case Close:
                break;
            }
        }
    }
    // for all contexts, during sdk initialization
    final ABSmartlyConfig sdkConfig = ABSmartlyConfig.create();
    sdkConfig.setContextEventLogger(new CustomEventLogger());

    // OR, alternatively, during a particular context initialization
    final ContextConfig contextConfig = ContextConfig.create();
    contextConfig.setEventLogger(new CustomEventLogger());
