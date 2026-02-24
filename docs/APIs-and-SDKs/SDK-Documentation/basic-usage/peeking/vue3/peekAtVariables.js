import { inject } from "vue";

const $absmartly = inject("$absmartly");

const variableValue = $absmartly.peekVariableValue("button.color", "red");
