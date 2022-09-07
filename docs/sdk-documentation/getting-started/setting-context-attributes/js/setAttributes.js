// Attributes are used to pass meta-data about the user and/or the request.
// They can be used later in the web console to setup segments.

context.attribute("user_agent", navigator.userAgent);

context.attributes({
  customer_age: "new_customer",
  url: location.toString(),
  referrer: document.referrer,
  screenName: "...",
  pageName: "...",
  blockName: "...",
  country: "gb",
  language: headers["Accept-Language"],
  channel: "google-ads",
});
