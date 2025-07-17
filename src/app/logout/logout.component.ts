import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../login/auth.service';

@Component({  
  selector: 'ib-logout',
  template: `
    <div class="logout-container">
      <div class="logout-card">
        <h2>Session Expired</h2>
        <p>Your session has expired or you are not authorized to access this page.</p>
        <p>Please log in again to continue.</p>
        <button (click)="goToLogin()" class="login-btn">
          Go to Login
        </button>
      </div>
    </div>
  `,
  styles: [`
    .logout-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .logout-card {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      text-align: center;
      max-width: 400px;
      width: 100%;
    }
    
    h2 {
      color: #333;
      margin-bottom: 20px;
      font-size: 1.8rem;
      font-weight: 600;
    }
    
    p {
      color: #6c757d;
      margin-bottom: 15px;
      line-height: 1.6;
    }
    
    .login-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 20px;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }
    }
  `],
  standalone: true
})
export class LogoutComponent implements OnInit {
  
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // Clear any existing session
    this.authService.logout();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
} 