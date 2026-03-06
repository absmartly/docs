context_config = Absmartly.create_context_config
context_config.set_unit('session_id', 'bf06d8cb5d8137290c4abb64155584fbdb64d8')

context = sdk.create_context_async(context_config)

context.wait_until_ready
