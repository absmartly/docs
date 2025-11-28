import React, { useEffect } from "react";
import { useABSmartly } from "react-sdk";

function App() {
  // Get the SDK object using the useABSmartly hook
  const sdk = useABSmartly();

  // Define a new context request
  const request = {
    units: {
      // All data will be hashed
      userId: "123",
      session_id: "5ebf06d8cb5d8137290c4abb64155584fbdb64d8",
      email: "support@absmartly.com",
      deviceId: "345",
    },
  };

  // Create a memo-ised context
  const context = sdk?.createContext(request);

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
