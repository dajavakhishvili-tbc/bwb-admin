import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe, TitleCasePipe } from '@angular/common';

interface LoanApplication {
  id: number;
  applicantName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  submittedDate: string;
  businessType: string;
  creditScore: number;
}

@Component({
  selector: 'ib-business-loan',
  templateUrl: './business-loan.component.html',
  styleUrl: './business-loan.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, TitleCasePipe],
})
export class BusinessLoanComponent {
  applications: LoanApplication[] = [
    { id: 1001, applicantName: 'John Smith', amount: 50000, status: 'pending', submittedDate: '2024-01-15', businessType: 'Restaurant', creditScore: 720 },
    { id: 1002, applicantName: 'Sarah Johnson', amount: 75000, status: 'approved', submittedDate: '2024-01-14', businessType: 'Retail', creditScore: 780 },
    { id: 1003, applicantName: 'Mike Davis', amount: 120000, status: 'processing', submittedDate: '2024-01-13', businessType: 'Manufacturing', creditScore: 650 },
    { id: 1004, applicantName: 'Lisa Wilson', amount: 35000, status: 'rejected', submittedDate: '2024-01-12', businessType: 'Consulting', creditScore: 580 },
    { id: 1005, applicantName: 'David Brown', amount: 90000, status: 'pending', submittedDate: '2024-01-11', businessType: 'Technology', creditScore: 810 },
    { id: 1006, applicantName: 'Emma Taylor', amount: 60000, status: 'approved', submittedDate: '2024-01-10', businessType: 'Healthcare', creditScore: 750 },
  ];

  filteredApplications(): LoanApplication[] {
    return this.applications;
  }

  getCreditScoreClass(score: number): string {
    if (score >= 750) return 'excellent';
    if (score >= 700) return 'good';
    if (score >= 650) return 'fair';
    return 'poor';
  }

  viewApplication(application: LoanApplication) {
    console.log('View application:', application);
  }

  editApplication(application: LoanApplication) {
    console.log('Edit application:', application);
  }
} 