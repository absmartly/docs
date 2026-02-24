import { inject } from "vue";

const $absmartly = inject("$absmartly");

$absmartly.override("exp_test_experiment", 1); // force variant 1 of treatment
$absmartly.overrides({
  exp_test_experiment: 1,
  exp_another_experiment: 0,
});
