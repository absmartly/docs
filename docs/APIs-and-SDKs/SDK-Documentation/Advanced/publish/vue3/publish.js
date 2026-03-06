import { useABSmartly } from "@absmartly/vue3-sdk";

const { context } = useABSmartly();

await context.value.publish().then(() => {
  window.location = "https://www.absmartly.com";
});
