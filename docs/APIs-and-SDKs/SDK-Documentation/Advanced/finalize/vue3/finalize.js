import { useABSmartly } from "@absmartly/vue3-sdk";

const { context } = useABSmartly();

await context.value.finalize().then(() => {
  window.location = "https://www.absmartly.com";
});
