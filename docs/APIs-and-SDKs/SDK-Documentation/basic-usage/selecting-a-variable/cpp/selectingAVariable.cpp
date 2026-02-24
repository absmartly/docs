nlohmann::json defaultButtonColorValue = "red";

nlohmann::json buttonColor = context.variable_value("button.color", defaultButtonColorValue);
