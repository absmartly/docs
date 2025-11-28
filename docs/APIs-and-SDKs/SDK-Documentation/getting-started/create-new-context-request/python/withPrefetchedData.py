# define a new context request
    context_config = ContextConfig()
    context_config.publish_delay = 10
    context_config.refresh_interval = 5
    context_config.units = {"session_id": "bf06d8cb5d8137290c4abb64155584fbdb64d8",
                            "user_id": "12345"}
    
    context_config = ContextConfig()
    ctx = sdk.create_context(context_config)
    ctx.wait_until_ready_async()
