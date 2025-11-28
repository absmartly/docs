analytics.ready(function () {
  // initialize ABSmartly SDK
  const sdk = new absmartly.SDK({
    endpoint: "https://your-absmartly-endpoint.absmartly.io/v1",
    apiKey: "<YOUR-API-KEY>",
    environment: "development",
    application: "YOUR-APP",
    eventLogger: (context, eventName, data) => {
      if (eventName == "exposure") {
        // filter only relevant and interesting exposures
        // if the assigned flag is false, this exposure was a treatment call that did not result in an assignment
        // this can happen if, for example, the experiment is no longer running, but treatment() calls are still in the application code
        if (exposure.assigned) {
          analytics.track("Experiment Viewed", {
            experiment_id: exposure.id,
            experiment_name: exposure.name,
            variation_id: exposure.variant,
            variation_name: "ABCDEFG"[exposure.variant],
          });
        }
      }
    },
  });

  const context = sdk.createContext(request);
  context.attribute("user_agent", navigator.userAgent);

  context
    .ready()
    .then((response) => {
      console.log("ABSmartly Context ready!");
      console.log(context.treatment("test-exp"));
    })
    .catch((error) => {
      console.log(error);
    });
});
