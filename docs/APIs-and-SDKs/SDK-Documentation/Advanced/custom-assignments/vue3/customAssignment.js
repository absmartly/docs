import { inject } from "vue";

const $absmartly = inject("$absmartly");

const chosenVariant = 1;

$absmartly.customAssignment("experiment_name", chosenVariant);
