treatment = context.treatment('homepage_banner_experiment')

if treatment == 1
  show_banner("Check out our latest deals!")
else
  show_banner("Welcome back!")
end
