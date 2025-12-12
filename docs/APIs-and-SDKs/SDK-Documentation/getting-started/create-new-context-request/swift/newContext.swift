let contextConfig: ContextConfig = ContextConfig()
contextConfig.setUnit(unitType: "device_id", uid: UIDevice.current.identifierForVendor!.uuidString))

let context = sdk.createContext(config: contextConfig)
context.waitUntilReady().done { context in
    print("context ready")
}
