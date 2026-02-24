context = sdk.create_context(
  units: {
    session_id: session[:id],
    customer_id: current_customer&.id
  }
)

context.ready

drop = ABSmartly::Liquid::Drop.new(context)
