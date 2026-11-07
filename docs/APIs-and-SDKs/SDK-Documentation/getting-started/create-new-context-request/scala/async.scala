import scala.concurrent.Await
import scala.concurrent.duration._

val units = Map(
  "session_id" -> "5ebf06d8cb5d8137290c4abb64155584fbdb64d8",
  "user_id" -> "123456"
)

val contextFuture = sdk.createContext(units)

val context = Await.result(contextFuture, 5.seconds)
