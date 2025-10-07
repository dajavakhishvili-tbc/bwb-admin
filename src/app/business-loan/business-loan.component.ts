import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageDialogComponent } from './business-loan-page-dialog/page-dialog.component';
import { PageConfig, DialogForm, DialogType } from './business-loan-page-dialog/page-dialog-model';

@Component({
  selector: 'ib-business-loan',
  templateUrl: './business-loan.component.html',
  styleUrl: './business-loan.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, PageDialogComponent],
})
export class BusinessLoanComponent {
  readonly pages = signal<PageConfig[]>([
    {
      id: 'business-loan-offer-details',
      title: 'Business Loan Offer Details',
      description: 'Detailed information about business loan offers',
      posthogEvent: 'business_loan_offer_details_viewed',
      createdAt: new Date('2024-01-16')
    },
    {
      id: 'business-loan-offer-request',
      title: 'Business Loan Offer Request',
      description: 'Request form for business loan offers',
      posthogEvent: 'business_loan_offer_request_viewed',
      createdAt: new Date('2024-01-16')
    },
    {
      id: 'business-loan-request-loader',
      title: 'Business Loan Request Loader',
      description: 'Loading interface for business loan requests',
      posthogEvent: 'business_loan_request_loader_viewed',
      createdAt: new Date('2024-01-16')
    },
    {
      id: 'business-loan-details',
      title: 'Business Loan Application Details',
      description: 'Comprehensive details about business loans',
      posthogEvent: 'business_loan_details_viewed',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'business-loan-signatures',
      title: 'Business Loan Signatures',
      description: 'Digital signature interface for business loans',
      posthogEvent: 'business_loan_signatures_viewed',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'business-loan-insurance',
      title: 'Business Loan Insurance',
      description: 'Insurance options and coverage for business loans',
      posthogEvent: 'business_loan_insurance_viewed',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'business-loan-conditions',
      title: 'Business Loan Conditions',
      description: 'Terms and conditions for business loans',
      posthogEvent: 'business_loan_conditions_viewed',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'business-loan-agreements',
      title: 'Business Loan Agreements',
      description: 'Legal agreements and contracts for business loans',
      posthogEvent: 'business_loan_agreements_viewed',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'business-loan-authorization',
      title: 'Business Loan Authorization',
      description: 'Authorization for business loans',
      posthogEvent: 'business_loan_auth_view',
      createdAt: new Date('2024-01-15')
    },
  ]);

  readonly showDialog = signal(false);
  readonly dialogType = signal<DialogType>('add');
  readonly selectedPage = signal<PageConfig | null>(null);
  readonly draggedPage = signal<PageConfig | null>(null);

  // Form data for dialog
  readonly dialogForm = signal<DialogForm>({
    title: '',
    description: '',
    posthogEvent: ''
  });

  addNewPage() {
    this.dialogForm.set({
      title: '',
      description: '',
      posthogEvent: ''
    });
    this.selectedPage.set(null);
    this.dialogType.set('add');
    this.showDialog.set(true);
  }

  editPage(page: PageConfig) {
    this.dialogForm.set({
      title: page.title,
      description: page.description,
      posthogEvent: page.posthogEvent
    });
    this.selectedPage.set(page);
    this.dialogType.set('edit');
    this.showDialog.set(true);
  }

  deletePage(page: PageConfig) {
    this.selectedPage.set(page);
    this.dialogType.set('delete');
    this.showDialog.set(true);
  }

  onDialogSave(form: DialogForm) {
    const selectedPage = this.selectedPage();

    if (selectedPage) {
      const updatedPages = this.pages().map(page => 
        page.id === selectedPage.id 
          ? { ...page, ...form }
          : page
      );
      this.pages.set(updatedPages);
    } else {
      // Add new page
      const newPage: PageConfig = {
        id: this.generatePageId(form.title),
        title: form.title,
        description: form.description,
        posthogEvent: form.posthogEvent,
        createdAt: new Date()
      };
      this.pages.set([newPage, ...this.pages()]);
    }

    this.closeDialog();
  }

  onDialogDelete() {
    const selectedPage = this.selectedPage();
    if (selectedPage) {
      const updatedPages = this.pages().filter(p => p.id !== selectedPage.id);
      this.pages.set(updatedPages);
    }
    this.closeDialog();
  }

  closeDialog() {
    this.showDialog.set(false);
    this.selectedPage.set(null);
    this.dialogForm.set({
      title: '',
      description: '',
      posthogEvent: ''
    });
  }

  // Drag and Drop functionality
  onDragStart(event: DragEvent, page: PageConfig) {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', page.id);
      this.draggedPage.set(page);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent) {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  }

  onDrop(event: DragEvent, targetPage: PageConfig) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
    
    const draggedPage = this.draggedPage();
    if (!draggedPage || draggedPage.id === targetPage.id) {
      this.draggedPage.set(null);
      return;
    }

    const currentPages = this.pages();
    const draggedIndex = currentPages.findIndex(p => p.id === draggedPage.id);
    const targetIndex = currentPages.findIndex(p => p.id === targetPage.id);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const reorderedPages = [...currentPages];
      const [removed] = reorderedPages.splice(draggedIndex, 1);
      reorderedPages.splice(targetIndex, 0, removed);
      this.pages.set(reorderedPages);
    }

    this.draggedPage.set(null);
  }

  onDragEnd(event: DragEvent) {
    this.draggedPage.set(null);
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  }

  private generatePageId(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
} 