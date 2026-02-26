import { useABSmartly } from "@absmartly/vue3-sdk";

const { context } = useABSmartly();

context.value.override("exp_test_experiment", 1); // force variant 1 of treatment
context.value.overrides({
  exp_test_experiment: 1,
  exp_another_experiment: 0,
});
