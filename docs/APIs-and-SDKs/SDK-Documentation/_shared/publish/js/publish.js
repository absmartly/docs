// You can just publish
context.publish();

// or wait for it to finish, so if you want to
// navigate to another page without losing impressions,
// you can do that once the promise resolves.
context.publish().then(function () {
  document.location.replace("another_page");
});
