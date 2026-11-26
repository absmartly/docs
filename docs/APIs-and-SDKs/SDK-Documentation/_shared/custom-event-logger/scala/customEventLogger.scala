import com.absmartly.sdk.{EventLogger, SDK, SDKConfig}
import io.circe.Json
import scala.concurrent.ExecutionContext.Implicits.global

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
      case "finalize" =>
        println("Context finalized")
      case _ =>
        println(s"Unknown event: $eventType")
    }
  }
}

val sdk = new SDK(SDKConfig(
  endpoint = "https://your-company.absmartly.io/v1",
  apiKey = "YOUR-API-KEY",
  application = "website",
  environment = "production",
  eventLogger = new CustomEventLogger()
))
