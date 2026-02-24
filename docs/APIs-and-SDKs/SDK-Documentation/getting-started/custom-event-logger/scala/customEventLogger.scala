import com.absmartly.sdk.EventLogger
import io.circe.Json

class CustomEventLogger extends EventLogger {
  override def logEvent(eventType: String, data: Json): Unit = {
    eventType match {
      case "exposure" =>
        println(s"Exposure event: ${data.noSpaces}")
      case "goal" =>
        println(s"Goal event: ${data.noSpaces}")
      case "error" =>
        println(s"Error event: ${data.noSpaces}")
      case "ready" =>
        println("Context ready")
      case "refresh" =>
        println("Context refreshed")
      case "publish" =>
        println("Events published")
      case "close" =>
        println("Context finalized")
      case _ =>
        println(s"Unknown event: $eventType")
    }
  }
}
