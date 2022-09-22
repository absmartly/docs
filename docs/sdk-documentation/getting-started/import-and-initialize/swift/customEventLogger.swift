// Example implementation
public class CustomEventLogger : ContextEventLogger {
    public func handleEvent(context: Context, event: ContextEventLoggerEvent) {
        switch event {
        case let .exposure(exposure):
            print("exposed to experiment: \(exposure.name)")
        case let .goal(goal):
            print("goal tracked: \(goal.name)")
        case let .error(error):
            print("error: ", error.localizedDescription)
        case let .publish(event):
            break
        case let .ready(data):
            break
        case let .refresh(data):
            break
        case .close:
            break
        }
    }
}

// for all contexts, during sdk initialization
let absmartlyConfig = ABSmartlyConfig()
absmartlyConfig.contextEventLogger = CustomEventLogger()

// OR, alternatively, during a particular context initialization
let contextConfig = ContextConfig()
contextConfig.eventLogger = CustomEventLogger()
