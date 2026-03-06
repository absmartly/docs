import { useABSmartly } from "@absmartly/vue3-sdk";

const { variableValue } = useABSmartly();

const defaultButtonColorValue = "red";

const buttonColor = variableValue("button.color", defaultButtonColorValue);
