func main() {
	var clientConfig = ClientConfig{
		Endpoint_:    "https://your-company.absmartly.io/v1",
		ApiKey_:      os.Getenv("ABSMARTLY_APIKEY"),
		Application_: os.Getenv(`ABSMARTLY_APPLICATION`), // created in the ABSmartly web console
		Environment_: os.Getenv(`ABSMARTLY_ENVIRONMENT`) // created in the ABSmartly web console
	}

	var sdkConfig = ABSmartlyConfig{Client_: CreateDefaultClient(clientConfig)}

	var sdk = Create(sdkConfig)

	// ...
}
