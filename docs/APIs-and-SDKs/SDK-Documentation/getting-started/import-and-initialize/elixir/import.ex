alias ABSmartly.SDK

{:ok, sdk} = SDK.new(
  endpoint: "https://your-company.absmartly.io/v1",
  api_key: System.get_env("ABSMARTLY_API_KEY"),
  application: "website",
  environment: "production"
)
