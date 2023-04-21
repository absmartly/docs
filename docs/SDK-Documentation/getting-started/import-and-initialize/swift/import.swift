import ABSmartly

let sdk: ABSmartlySDK
do {
    let clientConfig = ClientConfig(
        apiKey: ProcessInfo.processInfo.environment["ABSMARTLY_API_KEY"] ?? "",
        application: ProcessInfo.processInfo.environment["ABSMARTLY_APPLICATION"] ?? "",
        endpoint: ProcessInfo.processInfo.environment["ABSMARTLY_ENDPOINT"] ?? "",
        environment: ProcessInfo.processInfo.environment["ABSMARTLY_ENVIRONMENT"] ?? ""))

    let client = try DefaultClient(config: clientConfig)
    let sdkConfig = ABSmartlyConfig(client: client)
    sdk = try ABSmartlySDK(config: sdkConfig)
} catch {
    print(error.localizedDescription)
    return
}
