$context->setOverride("exp_test_experiment", 1); // force variant 1 of treatment

$context->setOverrides(
    [
        'exp_test_experiment' => 1,
        'exp_another_experiment' => 0,
    ]
);
