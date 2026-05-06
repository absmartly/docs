use ABSmartly\SDK\Client\ClientConfig;
use ABSmartly\SDK\Context\ContextEventLoggerCallback;

$contextConfig = new ContextConfig();
$contextConfig->setEventLogger(new ContextEventLoggerCallback(
    function (string $event, ?object $data) {
        // Custom callback
    }
));
