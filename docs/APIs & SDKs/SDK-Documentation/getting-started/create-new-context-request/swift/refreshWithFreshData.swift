let contextConfig: ContextConfig = ContextConfig()
contextConfig.setUnit(unitType: "device_id", uid: UIDevice.current.identifierForVendor!.uuidString)
contextConfig.refreshInterval = 4 * 3600; // every 4 hours
