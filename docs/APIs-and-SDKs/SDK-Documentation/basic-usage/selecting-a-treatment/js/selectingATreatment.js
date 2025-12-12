context.ready().then(function () {
  const variant = context.treatment("experiment_name");
  // A/B/C Test
  if (variant === 1) {
    // insert code to show on variant 1
  } else if (variant === 2) {
    // insert code to show on variant 2
  } else {
    // insert the control treatment code
  }
});

// or using async/await
async function runExperiment() {
  await context.ready();

  const variant = context.treatment("experiment_name");

  // A/B Test
  if (variant) {
    // insert code to show on variant 1
  } else {
    // insert the control treatment code
  }
}
