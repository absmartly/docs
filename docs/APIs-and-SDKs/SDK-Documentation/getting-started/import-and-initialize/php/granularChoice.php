use ABSmartly\SDK\Client\ClientConfig;
use ABSmartly\SDK\Client\Client;
use ABSmartly\SDK\Config;
use ABSmartly\SDK\SDK;
use ABSmartly\SDK\Context\ContextConfig;
use ABSmartly\SDK\Context\ContextEventLoggerCallback;

$clientConfig = new ClientConfig('', '', '', '');
$client = new Client($clientConfig);
$config = new Config($client);

$sdk = new SDK($config);

$contextConfig = new ContextConfig();
$contextConfig->setEventLogger(new ContextEventLoggerCallback(
    function (string $event, ?object $data) {
        // Custom callback
    }
));

$context = $sdk->createContext($contextConfig);

