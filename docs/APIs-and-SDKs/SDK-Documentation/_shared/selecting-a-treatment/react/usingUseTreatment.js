const { variant } = useTreatment("homepage_banner_experiment");

if (variant === 0) {
  return <Banner text="Welcome back!" />;
}

return <Banner text="Check out our latest deals!" />;
