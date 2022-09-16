return (
  <Treatment name="experiment_name" context={context} loading={<MySpinner />}>
    <DefaultButton></DefaultButton> {/* Variant 0 */}
    <VariantButton1></VariantButton1> {/* Variant 1 */}
    <VariantButton2></VariantButton2> {/* Variant 2 */}
  </Treatment>
);
