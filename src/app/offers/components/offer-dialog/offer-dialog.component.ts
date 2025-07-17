import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface OfferForm {
  title: string;
  description: string;
  imageUrl: string;
}

export type DialogType = 'add' | 'edit';

@Component({
  selector: 'ib-offer-dialog',
  templateUrl: './offer-dialog.component.html',
  styleUrl: './offer-dialog.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule]
})
export class OfferDialogComponent {
  @Input() isOpen = false;
  @Input() dialogType: DialogType = 'add';
  @Input() dialogForm: OfferForm = { title: '', description: '', imageUrl: '' };
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<OfferForm>();

  readonly form = signal<OfferForm>({ title: '', description: '', imageUrl: '' });
  readonly isFormValid = signal(false);
  readonly selectedFile = signal<File | null>(null);
  readonly imagePreview = signal<string>('');

  constructor() {
    this.updateFormValidation();
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.form.set({ ...this.dialogForm });
      this.selectedFile.set(null);
      this.imagePreview.set(this.dialogForm.imageUrl || '');
      this.updateFormValidation();
    }
  }

  onFormChange(): void {
    this.updateFormValidation();
  }

  updateFormValidation(): void {
    const currentForm = this.form();
    const isValid = currentForm.title.trim().length > 0 && 
                   currentForm.description.trim().length > 0 && 
                   (currentForm.imageUrl.trim().length > 0 || this.selectedFile() !== null);
    this.isFormValid.set(isValid);
  }

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    if (this.isFormValid()) {
      const formData = { ...this.form() };
      
      // If we have a selected file, convert it to a data URL
      if (this.selectedFile()) {
        const file = this.selectedFile()!;
        const reader = new FileReader();
        reader.onload = (e) => {
          formData.imageUrl = e.target?.result as string;
          this.save.emit(formData);
        };
        reader.readAsDataURL(file);
      } else {
        this.save.emit(formData);
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        return;
      }
      
      this.selectedFile.set(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      this.updateFormValidation();
    }
  }

  onTitleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.form.set({ ...this.form(), title: input.value });
    this.updateFormValidation();
  }

  onDescriptionChange(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    this.form.set({ ...this.form(), description: input.value });
    this.updateFormValidation();
  }

  removeSelectedFile(): void {
    this.selectedFile.set(null);
    this.imagePreview.set('');
    this.updateFormValidation();
  }

  getDialogTitle(): string {
    return this.dialogType === 'add' ? 'Add New Offer' : 'Edit Offer';
  }

  getSaveButtonText(): string {
    return this.dialogType === 'add' ? 'Create Offer' : 'Update Offer';
  }
} 