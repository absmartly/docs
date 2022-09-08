await this.$absmartly.publish().then(() => {
  document.location.replace("another_page");
});
