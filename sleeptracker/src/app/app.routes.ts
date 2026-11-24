import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      { path: 'log', loadComponent: () => import('./log/log.page').then(m => m.LogPage) },
      { path: 'history', loadComponent: () => import('./history/history.page').then(m => m.HistoryPage) },
      { path: '', redirectTo: 'log', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'tabs/log', pathMatch: 'full' },
];