data = sdk.get_client.get_context(
  units: { session_id: session[:id] }
)

context = sdk.create_context_with(
  { units: { session_id: session[:id] } },
  data
)

drop = ABSmartly::Liquid::Drop.new(context)
