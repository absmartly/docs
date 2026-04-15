$buttonColor = $context->getVariableValue('button.color', 'blue');
echo '<button style="background-color: ' . htmlspecialchars($buttonColor) . '">Get Started</button>';
