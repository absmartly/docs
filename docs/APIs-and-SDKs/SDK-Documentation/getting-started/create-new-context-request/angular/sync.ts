import { Component, inject } from '@angular/core';
import { ABSmartlyService } from '@absmartly/angular-sdk';

@Component({
  selector: 'app-root',
  template: `
    @if (absmartly.loading()) {
      <p>Loading experiments...</p>
    } @else {
      <app-main-content />
    }
  `,
})
export class AppComponent {
  absmartly = inject(ABSmartlyService);
}
