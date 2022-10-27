analytics.ready(function () {
  // initialize ABSmartly SDK
  const sdk = new absmartly.SDK({
    endpoint: "https://your-absmartly-endpoint.absmartly.io/v1",
    apiKey: "<YOUR-API-KEY>",
    environment: "development",
    application: "YOUR-APP",
  });

  // ABSmartly publisher implementation that publishes ABSmartly exposures to Segment,
  // instead of directly to the ABSmartly Collector
  // these will then be pushed by the ABSmartly segment integration to the ABSmartly collector
  class SegmentContextPublisher extends absmartly.ContextPublisher {
    constructor(segment) {
      super();

      this._segment = segment;
    }

    publish(request, sdk, context) {
      // NOTE: only exposures are expected to come via this route
      // other types of events should be tracked through the Segment API
      if (request.exposures) {
        for (const exposure of request.exposures) {
          this._segment.track(`Experiment Viewed`, {
            experiment_id: exposure.id,
            experiment_name: exposure.name,
            variation_id: exposure.variant,
            variation_name: "ABCDEFG"[exposure.variant],
            absmartly: Object.assign(
              {},
              {
                exposures: [exposure],
              },
              // add anything else in the a/b smartly payload that are not exposures or goals
              ...Object.entries(request)
                .filter((e) => e[0] !== "exposures" && e[0] !== "goals")
                .map((e) => ({ [e[0]]: e[1] }))
            ),
          });
        }
      }

      return Promise.resolve();
    }
  }

  // set this as the default publisher - all contexts created from now on will use it by default
  sdk.setContextPublisher(new SegmentContextPublisher(analytics));

  const request = {
    units: {
      userId: analytics.user().id(),
      anonymousId: analytics.user().anonymousId(),
    },
  };

  window.context = sdk.createContext(request);
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
