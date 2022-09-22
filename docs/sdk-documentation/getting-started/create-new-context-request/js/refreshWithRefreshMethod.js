setTimeout(async () => {
  try {
    context.refresh();
  } catch (error) {
    console.error(error);
  }
}, 5 * 60 * 1000);
