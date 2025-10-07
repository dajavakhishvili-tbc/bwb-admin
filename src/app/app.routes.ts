import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './login/auth.guard';
import { guestGuard } from './login/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { 
    path: 'logout', 
    loadComponent: () => import('./logout/logout.component').then(m => m.LogoutComponent)
  },
  { 
    path: 'home', 
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    // canActivate: [authGuard]
  },
  { 
    path: 'images', 
    loadComponent: () => import('./images/images.component').then(m => m.ImagesComponent),
    // canActivate: [authGuard]
  },
  { 
    path: 'texts', 
    loadComponent: () => import('./texts/texts.component').then(m => m.TextsComponent),
    // canActivate: [authGuard]
  },
  { 
    path: 'offers', 
    loadComponent: () => import('./offers/offers.component').then(m => m.OffersComponent),
    // canActivate: [authGuard]
  },
  {
    path: 'business-loan',
    // canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./business-loan/business-loan.component').then(m => m.BusinessLoanComponent)
      },
    
      {
        path: 'structure',
        loadComponent: () => import('./business-loan/business-loan.component').then(m => m.BusinessLoanComponent)
      },
      {
        path: 'maintenance',
        loadComponent: () => import('./admin-settings/admin-settings.component').then(m => m.AdminSettingsComponent)
      },
      {
        path: 'stats',
        loadComponent: () => import('./business-loan-stats/business-loan-stats.component').then(m => m.BusinessLoanStatsComponent)
      }
    ]
  },
  { 
    path: 'admin-settings', 
    loadComponent: () => import('./admin-settings/admin-settings.component').then(m => m.AdminSettingsComponent),
    // canActivate: [authGuard]
  },
];
