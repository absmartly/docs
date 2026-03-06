provideABSmartly({
  endpoint: 'https://your-company.absmartly.io/v1',
  apiKey: 'YOUR-API-KEY',
  environment: 'development',
  application: 'website',
  units: { session_id: 'abc123' },
  eventLogger: (context, eventName, data) => {
    switch (eventName) {
      case 'exposure':
        console.log('Exposed to experiment:', data.name);
        break;
      case 'goal':
        console.log('Goal tracked:', data.name);
        break;
      case 'error':
        console.error('SDK error:', data);
        break;
      case 'ready':
      case 'refresh':
      case 'publish':
      case 'finalize':
        break;
    }
  },
});
