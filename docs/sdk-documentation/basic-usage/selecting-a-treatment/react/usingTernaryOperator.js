return (
  <Treatment context={context} name="experiment_name">
    {({ variant, loading }) =>
      loading ? (
        <MySpinner />
      ) : variant === 1 ? (
        <ButtonVariant1 />
      ) : variant === 2 ? (
        <ButtonVariant2 />
      ) : (
        <DefaultButton />
      )
    }
  </Treatment>
);
