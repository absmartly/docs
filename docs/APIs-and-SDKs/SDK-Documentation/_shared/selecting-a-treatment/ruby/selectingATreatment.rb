treatment = context.treatment('homepage_banner_experiment')

if treatment.zero?
  show_banner("Welcome back!")
else
  show_banner("Check out our latest deals!")
end
