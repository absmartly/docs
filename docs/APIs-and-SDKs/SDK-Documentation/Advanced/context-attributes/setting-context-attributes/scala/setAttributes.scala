import io.circe.Json
import io.circe.syntax._

context.setAttribute("user_agent", "Mozilla/5.0".asJson)
context.setAttribute("customer_age", "new_customer".asJson)
context.setAttribute("age", 25.asJson)

context.setAttributes(Map(
  "user_agent" -> "Mozilla/5.0".asJson,
  "customer_age" -> "new_customer".asJson
))
