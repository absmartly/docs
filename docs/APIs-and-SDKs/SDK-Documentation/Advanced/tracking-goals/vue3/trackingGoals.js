import { useABSmartly } from "@absmartly/vue3-sdk";

const { track } = useABSmartly();

const properties = {
  price: 10000,
  category: "5 stars",
  free_cancellation: true,
  instance_id: 5350,
};

track("booking", properties);
