final treatment = await context.getTreatment("homepage_banner_experiment");

if (treatment == 1) {
  showBanner("Check out our latest deals!");
} else {
  showBanner("Welcome back!");
}
