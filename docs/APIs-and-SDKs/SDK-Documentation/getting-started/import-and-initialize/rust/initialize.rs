use absmartly_sdk::{ABsmartly, SDKConfig};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = SDKConfig::new(
        "https://your-company.absmartly.io/v1",
        "YOUR-API-KEY",
        "website",
        "development",
    );

    let sdk = ABsmartly::new(config)?;

    Ok(())
}
