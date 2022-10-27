// example absmartly middle to enrich segment track, page and screen events with relevant
analytics.ready(function () {
  // absmartly units - useful if you want to run experiments on units that are not your segment users
  const absmartlyMiddleware = function ({ payload, next, integrations }) {
    const type = payload.obj.type;
    switch (type) {
      case "track":
      case "page":
      case "screen":
        const event = payload.obj;
        const props = event.properties;

        const units = [];

        // always send the current user's units
        const anonymousId =
          "anonymousId" in event
            ? event["anonymousId"]
            : analytics.user().anonymousId();
        units.push({ type: "anonymousId", uid: anonymousId });

        // additionally, if we have any other units, add them
        if (event.userId) {
          units.push({ type: "userId", uid: event.userId });
        }

        // add any additional product units from properties, for example, when running product experiments
        // event will also be assigned to these units in absmartly
        if (props.productId) {
          units.push({ type: "productId", uid: props.productId });
        }

        if (props.products) {
          for (const product of props.products) {
            units.push({ type: "productId", uid: product.productId });
          }
        }

        props["absmartly"] = { units };
        break;
      default:
        break;
    }

    next(payload);
  };

  // add it as middleware
  analytics.addSourceMiddleware(absmartlyMiddleware);
});
