const { variant } = useTreatment("homepage_banner_experiment");

if (variant === 1) {
  return <Banner text="Check out our latest deals!" />;
}

return <Banner text="Welcome back!" />;
