import { inject } from "vue";

const $absmartly = inject("$absmartly");

const assignments = {
  experiment_name: 1,
  another_experiment_name: 0,
  a_third_experiment_name: 2,
};

$absmartly.customAssignments(assignments);
