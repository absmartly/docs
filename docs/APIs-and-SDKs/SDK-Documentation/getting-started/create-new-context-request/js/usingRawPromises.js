// define a new context request
const request = {
  units: {
    userId: "123",
    session_id: "5ebf06d8cb5d8137290c4abb64155584fbdb64d8",
    email: "support@absmartly.com", // strings will be hashed
    deviceId: "345",
  },
};

const context = sdk.createContext(request);

context
  .ready()
  .then((response) => {
    console.log("ABSmartly Context ready!");
  })
  .catch((error) => {
    console.log(error);
  });
