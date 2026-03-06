defmodule MyApp.CustomEventLogger do
  @behaviour ABSmartly.ContextEventLogger

  @impl true
  def handle_event(event_type, data) do
    case event_type do
      :error -> Logger.error("ABSmartly error: #{inspect(data)}")
      :ready -> Logger.info("ABSmartly context ready")
      :refresh -> Logger.info("ABSmartly context refreshed")
      :publish -> Logger.info("ABSmartly events published")
      :exposure -> Logger.info("ABSmartly exposure: #{inspect(data)}")
      :goal -> Logger.info("ABSmartly goal tracked: #{inspect(data)}")
      :close -> Logger.info("ABSmartly context closed")
    end
  end
end
