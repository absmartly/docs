import { inject } from "vue";

const $absmartly = inject("$absmartly");

await $absmartly.publish().then(() => {
  window.location = "https://www.absmartly.com";
});
