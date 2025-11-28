// In your server-side code
const serverSideParams = {
  units: {
    user_id: '123',
    anonymous_id: '456',
    session_id: '789',
    // ...
  },
};

const serverSideContext = sdk.createContext(serverSideParams);

await serverSideContext.ready();

const serverSideData = serverSideContext.data();

// In your client-side code
const clientSideOptions = {
  publishDelay: 100, // ms
};

const clientSideContext = sdk.createContextWith(serverSideParams, serverSideData, clientSideOptions);
