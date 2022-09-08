// You can just finalize and remove the variable reference
exp.finalize();
exp = null;
// finalize() returns a promise, so if you want to
// navigate to another page without losing impressions, you
// can do that once the promise resolves.
exp.finalize().then(function () {
  exp = null;
  document.location.replace("another_page");
});
