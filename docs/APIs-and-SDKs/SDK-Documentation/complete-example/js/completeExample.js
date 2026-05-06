const absmartly = require("@absmartly/javascript-sdk");

// Initialize the SDK
const sdk = new absmartly.SDK({
  endpoint: "https://your-company.absmartly.io/v1",
  apiKey: "YOUR-API-KEY",
  environment: "production",
  application: "website",
});

// Create a context for this user
const request = {
  units: {
    user_id: "user-12345",
  },
};

const context = sdk.createContext(request);

context.ready().then(() => {
  // Check which variant the user is in
  const treatment = context.treatment("homepage_banner_experiment");

  if (treatment === 1) {
    // Variant B: show a personalized banner
    showBanner("Welcome back, we have new deals for you!");
  } else {
    // Variant A (control): show the existing banner
    showBanner("Welcome back!");
  }

  // Use a variable set in the Web Console for more flexibility
  const buttonColor = context.variableValue("button.color", "blue");
  setButtonColor(buttonColor);

  // Track when the user clicks the CTA button
  document.getElementById("cta-button").addEventListener("click", () => {
    context.track("cta_click", { page: "homepage" });
  });

  // Track a purchase with revenue data
  onPurchaseComplete((order) => {
    context.track("purchase", {
      revenue: order.total,
      item_count: order.items.length,
    });
  });
});

// When the user leaves or the app shuts down, finalize the context
// to flush any remaining events
window.addEventListener("beforeunload", () => {
  context.finalize();
});
