const context = sdk.createContext(
  request,
  {
    refreshInterval: 5 * 60 * 1000,
  },
  {
    timeout: 1500,
  }
);
