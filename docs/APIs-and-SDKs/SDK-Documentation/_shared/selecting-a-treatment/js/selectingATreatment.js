const treatment = context.treatment("homepage_banner_experiment");

if (treatment === 1) {
  showBanner("Check out our latest deals!");
} else {
  showBanner("Welcome back!");
}
