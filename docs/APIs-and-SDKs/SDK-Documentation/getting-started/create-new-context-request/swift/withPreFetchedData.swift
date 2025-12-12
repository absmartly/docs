let contextConfig: ContextConfig = ContextConfig()
contextConfig.setUnit(unitType: "device_id", uid: UIDevice.current.identifierForVendor!.uuidString)

let context = sdk.createContextWithData(config: anotherContextConfig, contextData: contextData)
