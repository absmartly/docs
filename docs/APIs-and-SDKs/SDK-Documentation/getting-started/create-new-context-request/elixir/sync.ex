alias ABSmartly.{SDK, Context}

units = %{"session_id" => "5ebf06d8cb5d8137290c4abb64155584fbdb64d8"}

{:ok, context} = SDK.create_context(sdk, units)

true = Context.is_ready?(context)
