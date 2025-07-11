import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ImagesComponent } from './images/images.component';
import { BusinessLoanComponent } from './business-loan/business-loan.component';
import { TextsComponent } from './texts/texts.component';
import { EventsComponent } from './events/events.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'images', component: ImagesComponent },
  { path: 'texts', component: TextsComponent },
  { path: 'events', component: EventsComponent },
  { path: 'business-loan', component: BusinessLoanComponent },
];
