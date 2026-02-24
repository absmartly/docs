import { inject } from "vue";

const $absmartly = inject("$absmartly");

const treatment = $absmartly.treatment("exp_test_experiment");

if (treatment === 0) {
  // user is in control group (variant 0)
} else if (treatment === 1) {
  // user is in treatment group (variant 1)
}
