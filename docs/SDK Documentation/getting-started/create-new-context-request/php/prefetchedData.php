$contextConfig = new ContextConfig();
$contextConfig->setUnit('session_id', 'session_id5ebf06d8cb5d8137290c4abb64155584fbdb64d8'); // a unique id identifying the user

$context = $sdk->createContext($contextConfig);

$anotherContextConfig = new ContextConfig();
$anotherContextConfig->setUnit('session_id', 'session_id5ebf06d8cb5d8137290c4abb64155584fbdb64d8'); // a unique id identifying the user

$anotherContext = $sdk->createContextWithData($anotherContextConfig, $context->getContextData());
