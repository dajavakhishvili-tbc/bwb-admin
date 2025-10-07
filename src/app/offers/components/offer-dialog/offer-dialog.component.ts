import { Component, ChangeDetectionStrategy, signal, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface OfferForm {
  title: string;
  description: string;
  imageUrl: string;
  startDate?: Date;
  endDate?: Date;
  statsIframe?: string;
  type: 'dashboard' | 'offers' | 'whats-new';
}

export type DialogType = 'add' | 'edit';

@Component({
  selector: 'ib-offer-dialog',
  templateUrl: './offer-dialog.component.html',
  styleUrl: './offer-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule]
})
export class OfferDialogComponent {
  readonly isOpen = input(false);
  readonly dialogType = input<DialogType>('add');
  readonly dialogForm = input<OfferForm>({ title: '', description: '', imageUrl: '', statsIframe: '', type: 'dashboard' });
  
  readonly close = output<void>();
  readonly save = output<OfferForm>();

  readonly form = signal<OfferForm>({ title: '', description: '', imageUrl: '', statsIframe: '', type: 'dashboard' });
  readonly isFormValid = signal(false);
  readonly selectedFile = signal<File | null>(null);
  readonly imagePreview = signal<string>('');
  readonly dateValidationError = signal<string>('');

  constructor() {
    this.updateFormValidation();
  }

  ngOnChanges(): void {
    if (this.isOpen()) {
      const dialogForm = this.dialogForm();
      this.form.set({ ...dialogForm });
      this.selectedFile.set(null);
      this.imagePreview.set(dialogForm.imageUrl || '');
      this.validateDates();
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
                   (currentForm.imageUrl.trim().length > 0 || this.selectedFile() !== null) &&
                   this.dateValidationError().length === 0;
    this.isFormValid.set(isValid);
  }

  onClose(): void {
    // TODO: The 'emit' function requires a mandatory void argument
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

  onStatsIframeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.form.set({ ...this.form(), statsIframe: input.value });
    this.updateFormValidation();
  }

  onTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.form.set({ ...this.form(), type: select.value as 'dashboard' | 'offers' | 'whats-new' });
    this.updateFormValidation();
  }

  onStartDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const startDate = input.value ? new Date(input.value) : undefined;
    this.form.set({ ...this.form(), startDate });
    this.validateDates();
    this.updateFormValidation();
  }

  onEndDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const endDate = input.value ? new Date(input.value) : undefined;
    this.form.set({ ...this.form(), endDate });
    this.validateDates();
    this.updateFormValidation();
  }

  private validateDates(): void {
    const { startDate, endDate } = this.form();
    
    if (startDate && endDate && startDate > endDate) {
      this.dateValidationError.set('Start date cannot be newer than end date');
    } else {
      this.dateValidationError.set('');
    }
  }

  getDateValue(date: Date | undefined): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }

  removeSelectedFile(): void {
    this.selectedFile.set(null);
    this.imagePreview.set('');
    this.updateFormValidation();
  }

  getDialogTitle(): string {
    return this.dialogType() === 'add' ? 'Add New Offer' : 'Edit Offer';
  }

  getSaveButtonText(): string {
    return this.dialogType() === 'add' ? 'Create Offer' : 'Update Offer';
  }
} 