Vue.use(absmartly.ABSmartlyVue, {
  sdkOptions: {
    endpoint: "https://sandbox-api.absmartly.com/v1",
    apiKey: ABSMARTLY_API_KEY,
    environment: "production",
    application: "website",
    eventLogger: (context, eventName, data) => {
      if (eventName == "error") {
        console.error(data);
      }
    },
  },
  /* ... */
});
