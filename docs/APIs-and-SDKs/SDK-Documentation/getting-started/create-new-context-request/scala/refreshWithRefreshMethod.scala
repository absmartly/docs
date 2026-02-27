import scala.concurrent.Await
import scala.concurrent.duration._

val newDataFuture = sdk.fetchContextDataAsync()
val newData = Await.result(newDataFuture, 5.seconds)
context.refresh(newData)
