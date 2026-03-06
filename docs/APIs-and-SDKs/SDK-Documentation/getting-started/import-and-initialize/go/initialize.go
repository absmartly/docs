func main() {
	var clientConfig = ClientConfig{
		Endpoint:    "https://your-company.absmartly.io/v1",
		APIKey:      os.Getenv("ABSMARTLY_APIKEY"),
		Application: os.Getenv(`ABSMARTLY_APPLICATION`),
		Environment: os.Getenv(`ABSMARTLY_ENVIRONMENT`),
	}

	var sdkConfig = ABSmartlyConfig{Client: CreateDefaultClient(clientConfig)}

	var sdk = Create(sdkConfig)

	// ...
}

// Alternatively, using the sdk.New() constructor:
sdk, err := absmartly.New(
	"https://your-company.absmartly.io/v1",
	os.Getenv("ABSMARTLY_APIKEY"),
	os.Getenv("ABSMARTLY_APPLICATION"),
	os.Getenv("ABSMARTLY_ENVIRONMENT"),
)
