const assignments = {
  experiment_name: 1,
  another_experiment_name: 0,
  a_third_experiment_name: 2,
};

for (const [experiment, variant] of Object.entries(assignments)) {
  absmartly.customAssignment(experiment, variant);
}
