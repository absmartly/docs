context.ready().then(function() {
 if (context.treatment("experiment_name") == 1) {
     // insert code to show on variant 1
 } else if (context.treatment("experiment_name") == 2) {
     // insert code to show on variant 2
 } else {
     // insert the control treatment code
 }
});

// or using async/await
async function() {
    await context.ready();
    if (context.treatment("experiment_name")) {
        // insert code to show on variant 1
    } else {
        // insert the control treatment code
    }
}
