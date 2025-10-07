import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface LoginUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _isAuthenticated = signal(false);
  private readonly _currentUser = signal<LoginUser | null>(null);
  
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();

  constructor(private router: Router) {
    // Check if user is already logged in (from localStorage)
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this._currentUser.set(user);
        this._isAuthenticated.set(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(username: string, password: string): Promise<boolean> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple validation - in real app, this would be an API call
        if (username === 'admin' && password === 'password') {
          const user: LoginUser = {
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            role: 'admin'
          };
          
          // Store in localStorage
          localStorage.setItem('auth_token', 'fake-jwt-token');
          localStorage.setItem('user_data', JSON.stringify(user));
          
          // Update state
          this._currentUser.set(user);
          this._isAuthenticated.set(true);
          
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000); // Simulate network delay
    });
  }

  logout(): void {
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // Update state
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    
    // Navigate to login
    this.router.navigate(['/login']);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getCurrentUser(): LoginUser | null {
    return this._currentUser();
  }
} 