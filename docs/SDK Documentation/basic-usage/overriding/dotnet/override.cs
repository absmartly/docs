    context.SetOverride("exp_test_experiment", 1); // force variant 1 of treatment
    context.SetOverrides(new Dictionary<string, int>() {
        { "exp_test_experiment", 1 },
        { "exp_another_experiment", 0 }
    });
