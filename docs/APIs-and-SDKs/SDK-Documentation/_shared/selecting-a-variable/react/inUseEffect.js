const { context } = useABSmartly();
const buttonColor = context.variableValue("button.color", "blue");

return <button style={{ backgroundColor: buttonColor }}>Get Started</button>;
