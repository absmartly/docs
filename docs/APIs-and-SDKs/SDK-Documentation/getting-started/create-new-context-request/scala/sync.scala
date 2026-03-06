import scala.concurrent.Await
import scala.concurrent.duration._

val units = Map(
  "session_id" -> "5ebf06d8cb5d8137290c4abb64155584fbdb64d8",
  "user_id" -> "123456"
)

val contextDataFuture = sdk.fetchContextDataAsync()

val contextData = Await.result(contextDataFuture, 5.seconds)

val context = sdk.createContextWith(units, contextData)
