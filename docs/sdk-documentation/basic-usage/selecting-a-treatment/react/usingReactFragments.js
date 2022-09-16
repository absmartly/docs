return (
  <Treatment name="experiment_name" context={context} loading={<MySpinner />}>
    <>
      <DefaultLabel />
      <DefaultButton />
    </>
    <>
      <VariantLabel1 />
      <VariantButton1 />
    </>
    <>
      <VariantLabel2 />
      <VariantButton2 />
    </>
  </Treatment>
);
