import React, { useEffect, useMemo } from "react";
import { useABSmartly } from "react-sdk";

function App() {
  // Get the SDK object using the useABSmartly hook
  const sdk = useABSmartly();

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

  // Check if the context is ready in a useEffect hook
  useEffect(() => {
    context
      .ready()
      .then(() => {
        console.log("ABSmartly Context ready!");
      })
      .catch((error) => {
        console.error(error);
      });
  }, [context]);

  return (
    <div className="App">
      {
        // ...App content
      }
    </div>
  );
}

export default App;
