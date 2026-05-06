<Treatment
  attributes={{
    customer_time:
      user.created > new Date().getTime() - 24 * 60 * 60 * 1000
        ? "new_customer"
        : "returning_customer",
    user_type: user.isInternal ? "internal" : "normal",
    url: location.toString(),
    user_agent: navigator.userAgent,
    // ... any other attributes you want to set
}}>
  <TreatmentVariant variant={0}>
    <h1>Variant 0</h1>
  </TreatmentVariant>
  <TreatmentVariant variant={1}>
    <h1>Variant 1</h1>
  </TreatmentVariant>
</Treatment>
