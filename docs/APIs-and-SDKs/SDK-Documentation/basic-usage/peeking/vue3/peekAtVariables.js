import { useABSmartly } from "@absmartly/vue3-sdk";

const { context } = useABSmartly();

const variableValue = context.value.peekVariableValue("button.color", "red");
