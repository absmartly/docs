variant = Context.treatment(context, "exp_test_experiment")

if variant == 0 do
  # user is in control group (variant 0)
else
  # user is in treatment group
end
