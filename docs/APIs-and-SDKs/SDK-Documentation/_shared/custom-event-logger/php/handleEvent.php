use \ABSmartly\SDK\Context\ContextEventLoggerCallback;

class CustomLogger implements ContextEventLogger {
    public function handleEvent(Context $context, ContextEventLoggerEvent $event): void {
        // Process the log event
        // e.g
        // myLogFunction($event->getEvent(), $event->getData());
    }
}

$contextConfig = new ContextConfig();
$contextConfig->setEventLogger(CustomLogger());
