import { useABSmartly } from "@absmartly/vue3-sdk";

const { context } = useABSmartly();

context.value.attribute("user_agent", navigator.userAgent);

context.value.attributes({
  customer_age: "new_customer",
});
