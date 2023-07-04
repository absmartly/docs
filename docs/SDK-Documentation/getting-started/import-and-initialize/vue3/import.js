const absmartly = require('@absmartly/vue3-sdk');
// OR with ES6 modules:
import absmartly from '@absmartly/vue3-sdk';

// create vue app ...

app.use(absmartly.ABSmartlyVue, {
  sdkOptions: {
    endpoint: 'https://sandbox-api.absmartly.com/v1',
    apiKey: ABSMARTLY_API_KEY,
    environment: "production",
    application: "website",
  },
  context: {
    units: {
      session_id: '5ebf06d8cb5d8137290c4abb64155584fbdb64d8',
    },
  },
  attributes: {
    user_agent: navigator.userAgent
  },
  overrides: {
    exp_test_development: 1
  }
});
