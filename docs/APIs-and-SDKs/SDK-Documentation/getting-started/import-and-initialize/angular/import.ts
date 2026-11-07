import { ApplicationConfig } from '@angular/core';
import { provideABSmartly } from '@absmartly/angular-sdk';

export const appConfig: ApplicationConfig = {
  providers: [
    provideABSmartly({
      endpoint: 'https://your-company.absmartly.io/v1',
      apiKey: 'YOUR-API-KEY',
      environment: 'development', // created in the ABsmartly Web Console
      application: 'website', // created in the ABsmartly Web Console
      units: {
        session_id: '5ebf06d8cb5d8137290c4abb64155584fbdb64d8',
      },
    }),
  ],
};
