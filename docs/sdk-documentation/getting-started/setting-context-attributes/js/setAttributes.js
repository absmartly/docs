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
