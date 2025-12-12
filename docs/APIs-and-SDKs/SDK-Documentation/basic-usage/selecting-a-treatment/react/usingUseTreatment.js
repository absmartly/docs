const MyComponent = () => {
  const {
    variant,
    // loading,
    // error,
    // context
  } = useTreatment("experiment_name");

  if (variant === 1) return <VariantB />;
  if (variant === 2) return <VariantC />;
  if (variant === 3) return <VariantD />;

  // `variant` is 0
  return <DefaultComponent />;
};
