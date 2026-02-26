import { useABSmartly } from "@absmartly/vue3-sdk";

const { context } = useABSmartly();

const chosenVariant = 1;

context.value.customAssignment("experiment_name", chosenVariant);
