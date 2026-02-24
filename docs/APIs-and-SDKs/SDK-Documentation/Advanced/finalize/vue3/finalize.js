import { inject } from "vue";

const $absmartly = inject("$absmartly");

await $absmartly.finalize().then(() => {
  window.location = "https://www.absmartly.com";
});
