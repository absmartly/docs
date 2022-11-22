import React, { useEffect } from "react";
import { useABSmartly } from "react-sdk";

function App() {
  // Get the SDK object using the useABSmartly hook
  const { context } = useABSmartly();

  return (
    <div className="App">
      {
        // ...App content
      }
    </div>
  );
}

export default App;
