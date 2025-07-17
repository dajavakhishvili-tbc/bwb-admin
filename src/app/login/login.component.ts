import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'ib-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly username = signal('');
  readonly password = signal('');
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  
  private authService = inject(AuthService);
  private router = inject(Router);
  
  updateUsername(event: Event) {
    const target = event.target as HTMLInputElement;
    this.username.set(target.value);
    this.clearError();
  }
  
  updatePassword(event: Event) {
    const target = event.target as HTMLInputElement;
    this.password.set(target.value);
    this.clearError();
  }
  
  onSubmit() {
    if (!this.username().trim() || !this.password().trim()) {
      this.errorMessage.set('Please enter both username and password');
      return;
    }
    
    this.isLoading.set(true);
    this.clearError();
    
    this.authService.login(this.username().trim(), this.password()).then((success: boolean) => {
      if (success) {
        this.router.navigate(['/home']);
      } else {
        this.errorMessage.set('Invalid username or password');
      }
      this.isLoading.set(false);
    }).catch(() => {
      this.errorMessage.set('An error occurred during login');
      this.isLoading.set(false);
    });
  }
  
  private clearError() {
    if (this.errorMessage()) {
      this.errorMessage.set('');
    }
  }
} 