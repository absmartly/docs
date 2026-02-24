import { inject } from "vue";

const $absmartly = inject("$absmartly");

const defaultButtonColorValue = "red";

const buttonColor = $absmartly.variableValue(
  "button.color",
  defaultButtonColorValue
);
