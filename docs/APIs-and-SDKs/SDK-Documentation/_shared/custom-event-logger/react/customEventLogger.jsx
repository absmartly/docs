ReactDOM.render(
  <ABSmartly
    sdkOptions={{
      endpoint: "https://sandbox.absmartly.io/v1",
      apiKey: process.env.ABSMARTLY_API_KEY,
      application: process.env.APPLICATION_NAME,
      environment: process.env.NODE_ENV,
      eventLogger: (context, eventName, data) => {
        if (eventName == "error") {
          console.error(data);
        }
      },
    }}
    contextOptions={contextOptions}
  >
    <App />
  </ABSmartly>,
  document.getElementById("root")
);
