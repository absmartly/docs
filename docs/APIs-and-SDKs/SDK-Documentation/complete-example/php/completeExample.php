<?php

use \ABSmartly\SDK\SDK;
use \ABSmartly\SDK\Context\ContextConfig;

// Initialize the SDK
$sdk = SDK::createWithDefaults(
    endpoint: 'https://your-company.absmartly.io/v1',
    apiKey: 'YOUR-API-KEY',
    environment: 'production',
    application: 'website',
);

// Create a context for this user
$contextConfig = new ContextConfig();
$contextConfig->setUnit('user_id', 'user-12345');
$context = $sdk->createContext($contextConfig);

// Check which variant the user is in
$treatment = $context->getTreatment('homepage_banner_experiment');

if ($treatment === 0) {
    // Variant A (control): show the existing banner
    showBanner('Welcome back!');
} else {
    // Variant B: show a personalized banner
    showBanner('Welcome back, we have new deals for you!');
}

// Use a variable set in the Web Console for more flexibility
$buttonColor = $context->getVariableValue('button.color', 'blue');
setButtonColor($buttonColor);

// Track when the user completes a key action
$context->track('cta_click', (object) ['page' => 'homepage']);

// Track a purchase with revenue data
$context->track('purchase', (object) [
    'revenue' => 49.99,
    'item_count' => 3,
]);

// Close the context to flush remaining events
$context->close();
