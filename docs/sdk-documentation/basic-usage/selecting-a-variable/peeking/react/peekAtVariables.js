useEffect(() => {
  context
    .ready()
    .then(() => {
      if (context.peek("exp_test_experiment") == 0) {
        // User is in control group (variant 0)
      } else {
        // User is in treatment group
      }
    })
    .catch((error) => console.error(error));
}, [context]);
