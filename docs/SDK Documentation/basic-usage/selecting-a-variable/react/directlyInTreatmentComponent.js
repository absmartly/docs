const defaultButtonColorValue = "red";

return (
  <Treatment
    context={context}
    name="experiment_name"
    loadingComponent={<MySpinner />}
  >
    {({ variant, variables }) => (
      <ButtonComponent
        buttonColor={variables["button.color"] || defaultButtonColorValue}
      />
    )}
  </Treatment>
);
