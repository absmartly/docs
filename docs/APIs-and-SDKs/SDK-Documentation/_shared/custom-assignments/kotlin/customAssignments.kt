val assignments = mapOf(
    "experiment_name" to 1,
    "another_experiment_name" to 0,
    "a_third_experiment_name" to 2,
)

for ((experiment, variant) in assignments) {
    context.setCustomAssignment(experiment, variant)
}
