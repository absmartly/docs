import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import ABSmartly from "@absmartly/react-sdk";

const contextOptions = {
  units: {
    userId: "123",
    session_id: "5ebf06d8cb5d8137290c4abb64155584fbdb64d8",
    email: "support@absmartly.com",
    deviceId: "345",
  },
};

ReactDOM.render(
  <ABSmartly
    sdkOptions={{
      endpoint: "https://your-company.absmartly.io/v1",
      apiKey: process.env.ABSMARTLY_API_KEY,
      application: process.env.APPLICATION_NAME,
      environment: process.env.NODE_ENV,
    }}
    contextOptions={contextOptions}
  >
    <App />
  </ABSmartly>,
  document.getElementById("root")
);
