import absmartly from "@absmartly/vue2-sdk";

// For commonJS, use:
// const absmartly = require('@absmartly/vue2-sdk');

// Somewhere in your application initialization code, before mounting your Vue application
Vue.use(absmartly.ABSmartlyVue, {
  sdkOptions: {
    endpoint: "https://sandbox-api.absmartly.com/v1",
    apiKey: ABSMARTLY_API_KEY,
    environment: "production",
    application: "website",
  },
  context: {
    units: {
      session_id: "5ebf06d8cb5d8137290c4abb64155584fbdb64d8",
    },
  },
  attributes: {
    user_agent: navigator.userAgent,
  },
  overrides: {
    exp_test_development: 1,
  },
});
