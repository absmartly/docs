const { context } = useABSmartly();

const buttonColor = context.peekVariableValue("button.color", "red");
