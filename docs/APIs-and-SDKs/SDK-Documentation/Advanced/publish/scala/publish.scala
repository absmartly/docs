import scala.concurrent.Await
import scala.concurrent.duration._

val publishFuture = context.publish()
Await.result(publishFuture, 5.seconds)
