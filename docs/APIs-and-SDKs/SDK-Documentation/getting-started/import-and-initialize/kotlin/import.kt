import com.absmartly.sdk.*

fun main() {
    val contextData: ContextData = fetchContextData()

    val units = mutableMapOf("session_id" to "5ebf06d8cb5d8137290c4abb64155584fbdb64d8")
    val options = ContextOptions(publishDelay = -1, refreshPeriod = 0)

    val context = Context(
        data = contextData,
        units = units,
        options = options,
    )
}
