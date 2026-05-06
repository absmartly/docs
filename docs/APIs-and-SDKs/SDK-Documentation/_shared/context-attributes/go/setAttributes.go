context.SetAttribute("user_agent", req.GetHeader("User-Agent"));

context.SetAttributes(map[string]string{
        "customer_age": "new_customer",
}
