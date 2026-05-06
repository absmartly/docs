// main.js - Initialize the SDK as a Vue plugin
import { createApp } from "vue";
import App from "./App.vue";
import absmartly from "@absmartly/vue3-sdk";

const app = createApp(App);

app.use(absmartly.ABSmartlyVue, {
  sdkOptions: {
    endpoint: "https://your-company.absmartly.io/v1",
    apiKey: "YOUR-API-KEY",
    environment: "production",
    application: "website",
  },
  context: {
    units: { user_id: "user-12345" },
  },
  attributes: {
    user_agent: navigator.userAgent,
  },
});

app.mount("#app");

// In your component, use treatments and track goals:
//
// <template>
//   <div>
//     <treatment name="homepage_banner_experiment">
//       <template #A>  <!-- Variant A (control) -->
//         <banner text="Welcome back!" />
//       </template>
//       <template #B>  <!-- Variant B -->
//         <banner text="Welcome back, we have new deals for you!" />
//       </template>
//     </treatment>
//
//     <button @click="trackClick">Get Started</button>
//   </div>
// </template>
//
// <script>
// export default {
//   methods: {
//     trackClick() {
//       this.$absmartly.track("cta_click", { page: "homepage" });
//     },
//   },
//   beforeUnmount() {
//     this.$absmartly.finalize();
//   },
// };
// </script>
