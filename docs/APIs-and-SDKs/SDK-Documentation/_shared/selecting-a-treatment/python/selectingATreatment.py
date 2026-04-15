treatment = context.get_treatment("homepage_banner_experiment")

if treatment == 0:
    show_banner("Welcome back!")
elif treatment == 1:
    show_banner("Check out our latest deals!")
