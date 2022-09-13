// You can just publish
exp.publish();
// or wait for it to finish, so if you want to
// navigate to another page without losing impressions,
// you  can do that once the promise resolves.
exp.publish().then(function () {
  document.location.replace("another_page");
});
