import { useABSmartly } from "@absmartly/vue3-sdk";

const { context } = useABSmartly();

const assignments = {
  experiment_name: 1,
  another_experiment_name: 0,
  a_third_experiment_name: 2,
};

context.value.customAssignments(assignments);
