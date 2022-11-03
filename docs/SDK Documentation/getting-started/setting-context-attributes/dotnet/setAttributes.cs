    context.SetAttribute('user_agent', Request.Headers["User-Agent"]);

    context.SetAttributes(new Dictionary<string, object>() {
        { "customer_age", "new_customer" }
    });
