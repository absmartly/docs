buttonColor, _ := context.GetVariableValue("button.color", "blue")

if color, ok := buttonColor.(string); ok {
    renderButton(color)
}
