let treatment = context.peekTreatment(experimentName: "exp_test_experiment")

if treatment == 0 {
// user is in control group (variant 0)
} else {
// user is in treatment group
}
