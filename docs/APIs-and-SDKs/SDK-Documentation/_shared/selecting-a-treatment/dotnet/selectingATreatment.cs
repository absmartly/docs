var treatment = context.GetTreatment("homepage_banner_experiment");

if (treatment == 1) {
    ShowBanner("Check out our latest deals!");
} else {
    ShowBanner("Welcome back!");
}
