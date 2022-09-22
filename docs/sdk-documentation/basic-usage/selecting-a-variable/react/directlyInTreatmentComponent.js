const defaultButtonColorValue = "red";

return (
  <Treatment context={context} name="experiment_name">
    {({ variant, variables, loading }) =>
      loading ? (
        <MySpinner />
      ) : (
        <ButtonComponent
          buttonColor={variables["button.color"] || defaultButtonColorValue}
        />
      )
    }
  </Treatment>
);
