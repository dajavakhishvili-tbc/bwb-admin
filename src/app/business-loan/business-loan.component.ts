import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PageConfig {
  id: string;
  title: string;
  description: string;
  posthogEvent: string;
  createdAt: Date;
}

@Component({
  selector: 'ib-business-loan',
  templateUrl: './business-loan.component.html',
  styleUrl: './business-loan.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
})
export class BusinessLoanComponent {
  readonly pages = signal<PageConfig[]>([
    {
      id: 'business-loan-conditions',
      title: 'Business Loan Conditions',
      description: 'Terms and conditions for business loans',
      posthogEvent: 'business_loan_conditions_viewed',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'loan-application-process',
      title: 'Loan Application Process',
      description: 'Step-by-step guide for loan applications',
      posthogEvent: 'loan_application_process_viewed',
      createdAt: new Date('2024-01-14')
    }
  ]);

  readonly showAddDialog = signal(false);
  readonly showEditDialog = signal(false);
  readonly showDeleteDialog = signal(false);
  readonly selectedPage = signal<PageConfig | null>(null);
  readonly draggedPage = signal<PageConfig | null>(null);

  // Form data for dialog
  readonly dialogForm = signal({
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
    this.showAddDialog.set(true);
  }

  editPage(page: PageConfig) {
    this.dialogForm.set({
      title: page.title,
      description: page.description,
      posthogEvent: page.posthogEvent
    });
    this.selectedPage.set(page);
    this.showEditDialog.set(true);
  }

  deletePage(page: PageConfig) {
    this.selectedPage.set(page);
    this.showDeleteDialog.set(true);
  }

  confirmDelete() {
    const selectedPage = this.selectedPage();
    if (selectedPage) {
      const updatedPages = this.pages().filter(p => p.id !== selectedPage.id);
      this.pages.set(updatedPages);
    }
    this.closeDeleteDialog();
  }

  savePage() {
    const form = this.dialogForm();
    const selectedPage = this.selectedPage();

    if (selectedPage) {
      // Edit existing page
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

  closeDialog() {
    this.showAddDialog.set(false);
    this.showEditDialog.set(false);
    this.selectedPage.set(null);
    this.dialogForm.set({
      title: '',
      description: '',
      posthogEvent: ''
    });
  }

  closeDeleteDialog() {
    this.showDeleteDialog.set(false);
    this.selectedPage.set(null);
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

  getDialogTitle(): string {
    return this.selectedPage() ? 'Edit Page' : 'Add New Page';
  }

  getSaveButtonText(): string {
    return this.selectedPage() ? 'Update Page' : 'Add Page';
  }
} 