defmodule MyApp.CustomEventLogger do
  require Logger

  def handle_event(event_type, data) do
    case event_type do
      :error -> Logger.error("ABSmartly error: #{inspect(data)}")
      :ready -> Logger.info("ABSmartly context ready")
      :refresh -> Logger.info("ABSmartly context refreshed")
      :publish -> Logger.info("ABSmartly events published")
      :exposure -> Logger.info("ABSmartly exposure: #{inspect(data)}")
      :goal -> Logger.info("ABSmartly goal tracked: #{inspect(data)}")
      :finalize -> Logger.info("ABSmartly context finalized")
      _ -> :ok
    end
  end
end

# pass the handler when creating a context
{:ok, context} =
  ABSmartly.SDK.create_context(sdk, units, %{
    event_handler: &MyApp.CustomEventLogger.handle_event/2
  })
