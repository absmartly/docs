context.attribute("user_agent", navigator.userAgent);

context.attributes({
  customer_time:
    user.created > new Date().getTime() - 24 * 60 * 60 * 1000
      ? "new_customer"
      : "returning_customer",
  user_type: user.isInternal ? "internal" : "normal",
  url: location.toString(),
  user_agent: navigator.userAgent,
  referrer: document.referrer,
  screenName,
  pageName,
  country: headers["HTTP_CF_IPCOUNTRY"],
  language: headers["Accept-Language"],
  channel: query_params.utm_medium,
});
