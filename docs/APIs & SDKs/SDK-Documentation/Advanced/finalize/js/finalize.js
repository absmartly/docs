// You can just finalize and remove the variable reference
context.finalize();
context = null;
// finalize() returns a promise, so if you want to
// navigate to another page without losing impressions, you
// can do that once the promise resolves.
context.finalize().then(function () {
  context = null;
  document.location.replace("another_page");
});
