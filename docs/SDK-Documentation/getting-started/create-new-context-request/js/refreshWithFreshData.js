const request = {
  units: {
    session_id: "5ebf06d8cb5d8137290c4abb64155584fbdb64d8",
  },
};

const context = sdk.createContext(request, {
  refreshInterval: 5 * 60 * 1000,
});
