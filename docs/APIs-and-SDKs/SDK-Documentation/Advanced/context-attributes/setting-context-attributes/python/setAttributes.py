    context.set_attribute("user_agent", req.get_header("User-Agent"))
    
    context.set_attributes({
            "customer_age": "new_customer"
    })
