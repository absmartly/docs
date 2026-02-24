import { inject } from "vue";

const $absmartly = inject("$absmartly");

const properties = {
  price: 10000,
  category: "5 stars",
  free_cancellation: true,
  instance_id: 5350,
};

$absmartly.track("booking", properties);
