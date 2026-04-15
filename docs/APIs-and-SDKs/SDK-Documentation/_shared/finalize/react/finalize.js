const { context } = useABSmartly();

context.finalize().then(() => {
  document.location.replace("another_page");
});
