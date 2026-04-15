final treatment = await context.getTreatment("homepage_banner_experiment");

if (treatment == 0) {
  showBanner("Welcome back!");
} else if (treatment == 1) {
  showBanner("Check out our latest deals!");
}
