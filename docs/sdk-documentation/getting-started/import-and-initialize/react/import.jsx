import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import ABSmartly from "@absmartly/react-sdk";

ReactDOM.render(
  <ABSmartly
    sdkOptions={{
      endpoint: "https://sandbox.absmartly.io/v1",
      apiKey: process.env.ABSMARTLY_API_KEY,
      application: process.env.APPLICATION_NAME,
      environment: process.env.NODE_ENV,
    }}
  >
    <App />
  </ABSmartly>,
  document.getElementById("root")
);
