var treatment = context.GetTreatment("homepage_banner_experiment");

if (treatment == 0) {
    ShowBanner("Welcome back!");
} else if (treatment == 1) {
    ShowBanner("Check out our latest deals!");
}
