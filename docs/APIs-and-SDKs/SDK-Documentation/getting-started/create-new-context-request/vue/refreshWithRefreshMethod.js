setTimeout(async () => {
  try {
    this.$absmartly.refresh();
  } catch (error) {
    console.error(error);
  }
}, 5 * 60 * 1000);
