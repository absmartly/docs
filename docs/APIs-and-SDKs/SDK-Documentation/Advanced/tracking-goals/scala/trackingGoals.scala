import io.circe.Json
import io.circe.syntax._

context.track("payment")

context.track("purchase", Some(Map(
  "item_count" -> Json.fromInt(1),
  "total_amount" -> Json.fromDoubleOrNull(1999.99)
)))
