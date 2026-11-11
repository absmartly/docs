user_agent =
  case Plug.Conn.get_req_header(conn, "user-agent") do
    [value | _] -> value
    [] -> "unknown"
  end

Context.set_attribute(context, "user_agent", user_agent)

Context.set_attributes(context, %{
  "customer_age" => "new_customer"
})
