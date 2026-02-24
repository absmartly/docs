import { inject } from "vue";

const $absmartly = inject("$absmartly");

if ($absmartly.peek("exp_test_experiment") == 0) {
  // user is in control group (variant 0)
} else {
  // user is in treatment group
}
