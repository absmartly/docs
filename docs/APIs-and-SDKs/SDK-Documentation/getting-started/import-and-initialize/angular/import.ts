import { provideABSmartly } from '@absmartly/angular-sdk';

export const appConfig = {
  providers: [
    provideABSmartly({
      endpoint: 'https://your-company.absmartly.io/v1',
      apiKey: process.env.ABSMARTLY_API_KEY,
      environment: process.env.NODE_ENV,
      application: process.env.APPLICATION_NAME,
      units: {
        session_id: '5ebf06d8cb5d8137290c4abb64155584fbdb64d8',
      },
    }),
  ],
};
