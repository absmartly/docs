this.$absmartly.override("exp_test_experiment", 1); // force variant 1 of treatment
this.$absmartly.overrides({
  exp_test_experiment: 1,
  exp_another_experiment: 0,
});
