import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './login/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'logout', 
    loadComponent: () => import('./logout/logout.component').then(m => m.LogoutComponent)
  },
  { 
    path: 'home', 
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'images', 
    loadComponent: () => import('./images/images.component').then(m => m.ImagesComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'texts', 
    loadComponent: () => import('./texts/texts.component').then(m => m.TextsComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'events', 
    loadComponent: () => import('./events/events.component').then(m => m.EventsComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'offers', 
    loadComponent: () => import('./offers/offers.component').then(m => m.OffersComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'business-loan', 
    loadComponent: () => import('./business-loan/business-loan.component').then(m => m.BusinessLoanComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'admin-settings', 
    loadComponent: () => import('./admin-settings/admin-settings.component').then(m => m.AdminSettingsComponent),
    canActivate: [authGuard]
  },
];
