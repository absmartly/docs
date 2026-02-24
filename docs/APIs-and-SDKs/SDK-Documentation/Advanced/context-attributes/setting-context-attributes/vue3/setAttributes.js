import { inject } from "vue";

const $absmartly = inject("$absmartly");

$absmartly.attribute("user_agent", navigator.userAgent);

$absmartly.attributes({
  customer_age: "new_customer",
});
