return (
  <Treatment
    name="experiment_name"
    context={context}
    loadingComponent={<MySpinner />}
  >
    {/* The variant prop can have numbers or letters passed to it */}
    <TreatmentVariant variant="A">
      {/* Variant 0 */}
      <DefaultButton />
    </TreatmentVariant>
    <TreatmentVariant variant="B">
      {/* Variant 1 */}
      <ButtonVariant1 />
    </TreatmentVariant>
    <TreatmentVariant variant="C">
      {/* Variant 2 */}
      <ButtonVariant2 />
    </TreatmentVariant>
  </Treatment>
);
