// This example shows multiple React patterns - pick the one that fits your component
import ABSmartly, {
  Treatment,
  TreatmentVariant,
  useABSmartly,
  useTreatment,
} from "@absmartly/react-sdk";

function App() {
  const sdkOptions = {
    endpoint: "https://your-company.absmartly.io/v1",
    apiKey: "YOUR-API-KEY",
    environment: "production",
    application: "website",
  };

  const contextOptions = {
    units: { user_id: "user-12345" },
  };

  return (
    <ABSmartly sdkOptions={sdkOptions} contextOptions={contextOptions}>
      <Homepage />
    </ABSmartly>
  );
}

function CtaButton({ onClick }) {
  const { variant } = useTreatment("cta_color_experiment");

  const color = variant === 1 ? "blue" : "green";

  return (
    <button onClick={onClick} style={{ backgroundColor: color }}>
      Get Started
    </button>
  );
}

function Homepage() {
  const { context } = useABSmartly();

  const handleCtaClick = () => {
    context.track("cta_click", { page: "homepage" });
  };

  const handlePurchase = (order) => {
    context.track("purchase", {
      revenue: order.total,
      item_count: order.items.length,
    });
  };

  return (
    <div>
      {/* Option 1: useTreatment hook for programmatic variant logic */}
      <CtaButton onClick={handleCtaClick} />

      {/* Option 2: Treatment components for declarative variant rendering */}
      <Treatment name="homepage_banner_experiment">
        <TreatmentVariant variant={0}>
          <Banner text="Welcome back!" />
        </TreatmentVariant>
        <TreatmentVariant variant={1}>
          <Banner text="Welcome back, we have new deals for you!" />
        </TreatmentVariant>
      </Treatment>
    </div>
  );
}
