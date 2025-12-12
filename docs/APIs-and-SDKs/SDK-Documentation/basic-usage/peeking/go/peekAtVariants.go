var res, _ = context.PeekTreatment("exp_test_experiment")
if res == 0 {
	// user is in control group (variant 0)
} else {
	// user is in treatment group
}
