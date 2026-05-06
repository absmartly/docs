context.setAttribute('user_agent', req.getHeader("User-Agent"));

context.setAttributes(Map.of(
    "customer_age", "new_customer"
));
