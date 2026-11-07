context_config = Absmartly.create_context_config
context_config.set_unit('session_id', session[:id])
context_config.set_unit('customer_id', current_customer.id) if current_customer

context = Absmartly.create_context(context_config)

drop = ABsmartly::Liquid::Drop.new(context)
