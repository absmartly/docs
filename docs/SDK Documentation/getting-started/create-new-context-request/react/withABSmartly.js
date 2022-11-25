import React from "react";
import { withABSmartly } from "react-sdk";

// The absmartly object comes from the withABSmartly HOC
function App({ absmartly }) {
  const { context } = absmartly;

  return (
    <div className="App">
      {
        // ...App content
      }
    </div>
  );
}

// Export the component wrapped in the withABSmartly HOC
export default withABSmartly(App);
