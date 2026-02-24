import scala.concurrent.Await
import scala.concurrent.duration._

val finalizeFuture = context.finalizeContext()
Await.result(finalizeFuture, 5.seconds)
