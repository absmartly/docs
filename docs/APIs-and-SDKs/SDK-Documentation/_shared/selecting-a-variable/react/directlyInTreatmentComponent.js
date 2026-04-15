const defaultButtonColorValue = "red";

return (
  <TreatmentFunction
    context={context}
    name="experiment_name"
    loadingComponent={<MySpinner />}
  >
    {({ variant, variables }) => (
      <ButtonComponent
        buttonColor={variables["button.color"] || defaultButtonColorValue}
      />
    )}
  </TreatmentFunction>
);
