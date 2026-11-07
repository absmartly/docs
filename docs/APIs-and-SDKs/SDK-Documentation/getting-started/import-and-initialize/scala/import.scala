import com.absmartly.sdk.{SDK, SDKConfig}
import scala.concurrent.ExecutionContext.Implicits.global

val config = SDKConfig(
  endpoint = "https://your-company.absmartly.io/v1",
  apiKey = "YOUR-API-KEY",
  environment = "development",
  application = "website"
)

val sdk = new SDK(config)
