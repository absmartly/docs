context_config = Absmartly.create_context_config
context_config.set_unit('session_id', session[:id])

data = Absmartly.context_data

context = Absmartly.create_context_with(context_config, data)

drop = ABsmartly::Liquid::Drop.new(context)
