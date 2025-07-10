import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ImagesComponent } from './images/images.component';
import { BusinessLoanComponent } from './business-loan/business-loan.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'images', component: ImagesComponent },
  { path: 'business-loan', component: BusinessLoanComponent },
];
