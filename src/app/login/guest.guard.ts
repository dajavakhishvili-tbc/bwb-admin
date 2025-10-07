import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const guestGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // User is logged in, redirect to home
    router.navigate(['/home']);
    return false;
  } else {
    // User is not logged in, allow access to login page
    return true;
  }
};
