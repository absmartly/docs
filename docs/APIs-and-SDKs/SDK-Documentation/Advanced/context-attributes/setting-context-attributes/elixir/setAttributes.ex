Context.set_attribute(context, "user_agent", req.headers["user-agent"])

Context.set_attributes(context, %{
  "customer_age" => "new_customer"
})
