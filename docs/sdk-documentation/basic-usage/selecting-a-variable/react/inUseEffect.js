const context = React.useMemo(
  () => sdk.createContext({ units: { user_id: "1234" } }),
  [sdk]
);

const [buttonColor, setButtonColor] = React.useState("red");

useEffect(() => {
  const defaultButtonColorValue = "red";
  context
    .ready()
    .then(() => {
      setButtonColor(
        context.variableValue("button.color", defaultButtonColorValue)
      );
    })
    .catch((error) => console.error(error));
}, [context]);
