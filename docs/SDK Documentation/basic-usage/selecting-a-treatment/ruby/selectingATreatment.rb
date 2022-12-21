treatment = context.treatment('exp_test_experiment')

if treatment.zero?
  # user is in control group (variant 0)
else
  # user is in treatment group
end
