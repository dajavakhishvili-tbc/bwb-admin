import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';

export interface PageConfig {
  id: string;
  title: string;
  description: string;
  posthogEvent: string;
  createdAt: Date;
}

export interface DialogForm {
  title: string;
  description: string;
  posthogEvent: string;
}

export type DialogType = 'add' | 'edit' | 'delete';

@Component({
  selector: 'ib-page-dialog',
  templateUrl: './page-dialog.component.html',
  styleUrl: './page-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
})
export class PageDialogComponent {
  @Input() dialogType: DialogType = 'add';
  @Input() selectedPage: PageConfig | null = null;
  @Input() dialogForm: DialogForm = { title: '', description: '', posthogEvent: '' };
  @Input() isOpen = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<DialogForm>();
  @Output() delete = new EventEmitter<void>();
  @Output() formChange = new EventEmitter<DialogForm>();

  getDialogTitle(): string {
    switch (this.dialogType) {
      case 'add':
        return 'Add New Page';
      case 'edit':
        return 'Edit Page';
      case 'delete':
        return 'Delete Page';
      default:
        return '';
    }
  }

  getSaveButtonText(): string {
    return this.dialogType === 'edit' ? 'Update Page' : 'Add Page';
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    this.save.emit(this.dialogForm);
  }

  onDelete() {
    this.delete.emit();
  }

  onFormChange() {
    this.formChange.emit(this.dialogForm);
  }
} 