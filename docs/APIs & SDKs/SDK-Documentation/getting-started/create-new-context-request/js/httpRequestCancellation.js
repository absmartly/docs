const controller = new absmartly.AbortController();
const context = sdk.createContext(
  request,
  {
    refreshInterval: 5 * 60 * 1000,
  },
  {
    signal: controller.signal,
  }
);

// abort request if not ready after 1500ms
const timeoutId = setTimeout(() => controller.abort(), 1500);

await context.ready();

clearTimeout(timeoutId);
