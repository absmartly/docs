const { context } = useABSmartly();

context.publish().then(() => {
  document.location.replace("another_page");
});
