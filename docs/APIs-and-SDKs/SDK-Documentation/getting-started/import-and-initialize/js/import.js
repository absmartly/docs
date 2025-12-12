// ES6 Modules
import absmartly from "@absmartly/javascript-sdk";

// For commonJS, use:
// const absmartly = require("@absmartly/javascript-sdk");

const sdk = new absmartly.SDK({
  endpoint: "https://your-company.absmartly.io/v1",
  apiKey: process.env.ABSMARTLY_API_KEY,
  environment: process.env.NODE_ENV,
  application: process.env.APPLICATION_NAME,
});
