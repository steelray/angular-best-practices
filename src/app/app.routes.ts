import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'exhausted-event',
    loadComponent: () => import('./exhausted-event/exhausted-event.component').then(c => c.ExhaustedEventComponent)
  }
];
