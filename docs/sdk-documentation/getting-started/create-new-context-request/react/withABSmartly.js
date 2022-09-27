import React from "react";
import { withABSmartly } from "react-sdk";

// The sdk object comes from the withABSmartly HOC
function App({ sdk }) {
  // Define a new context request
  const request = {
    units: {
      userId: "123",
      session_id: "5ebf06d8cb5d8137290c4abb64155584fbdb64d8",
      email: "support@absmartly.com", // strings will be hashed
      deviceId: "345",
    },
  };

  // Create a context
  const context = sdk.createContext(request);

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
