treatment, _ := context.GetTreatment("homepage_banner_experiment")

if treatment == 1 {
    showBanner("Check out our latest deals!")
} else {
    showBanner("Welcome back!")
}
