# define a new context request
    context_config = ContextConfig()
    context_config.publish_delay = 10
    context_config.refresh_interval = 5

    context_config = ContextConfig()
    ctx = sdk.create_context(context_config)
    ctx.wait_until_ready_async()
