return (
  <TreatmentFunction
    context={context}
    name="experiment_name"
    loadingComponent={<MySpinner />}
  >
    {({ variant }) =>
      variant === 1 ? (
        <ButtonVariant1 />
      ) : variant === 2 ? (
        <ButtonVariant2 />
      ) : (
        <DefaultButton />
      )
    }
  </TreatmentFunction>
);
