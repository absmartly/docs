package main

import (
	"fmt"
	"os"

	absmartly "github.com/absmartly/go-sdk"
)

func main() {
	// Initialize the SDK
	clientConfig := absmartly.ClientConfig{
		Endpoint_:    "https://your-company.absmartly.io/v1",
		ApiKey_:      os.Getenv("ABSMARTLY_APIKEY"),
		Application_: "website",
		Environment_: "production",
	}

	sdkConfig := absmartly.ABSmartlyConfig{
		Client_: absmartly.CreateDefaultClient(clientConfig),
	}
	sdk := absmartly.Create(sdkConfig)

	// Create a context for this user
	contextConfig := absmartly.ContextConfig{
		Units_: map[string]string{
			"user_id": "user-12345",
		},
	}
	ctx := sdk.CreateContext(contextConfig)
	ctx.WaitUntilReady()

	// Check which variant the user is in
	treatment, err := ctx.GetTreatment("homepage_banner_experiment")
	if err != nil {
		fmt.Println("Error getting treatment:", err)
		return
	}

	if treatment == 1 {
		// Variant B: show a personalized banner
		showBanner("Welcome back, we have new deals for you!")
	} else {
		// Variant A (control): show the existing banner
		showBanner("Welcome back!")
	}

	// Use a variable set in the Web Console for more flexibility
	buttonColor, err := ctx.GetVariableValue("button.color", "blue")
	if err != nil {
		fmt.Println("Error getting variable:", err)
		return
	}
	setButtonColor(buttonColor)

	// Track when the user completes a key action
	ctx.Track("cta_click", map[string]interface{}{
		"page": "homepage",
	})

	// Track a purchase with revenue data
	ctx.Track("purchase", map[string]interface{}{
		"revenue":    49.99,
		"item_count": 3,
	})

	// Close the context to flush remaining events
	ctx.Close()
}
