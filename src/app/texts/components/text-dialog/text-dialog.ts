import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface TextFormData {
  english: string;
  georgian: string;
  key: string;
  channels: string[];
  labels: string[];
}

@Component({
  selector: 'ib-text-dialog',
  imports: [FormsModule],
  templateUrl: './text-dialog.html',
  styleUrls: ['./text-dialog.scss']
})
export class TextDialogComponent {
  isOpen = input.required<boolean>();
  isEditing = input.required<boolean>();
  formData = input.required<TextFormData>();

  close = output<void>();
  submit = output<TextFormData>();

  readonly form = signal<TextFormData>({
    english: '',
    georgian: '',
    key: '',
    channels: [],
    labels: []
  });

  readonly labelInput = signal<string>('');

  readonly isFormValid = computed(() => {
    const currentForm = this.form();
    return currentForm.english.trim().length > 0 && 
           currentForm.georgian.trim().length > 0 && 
           currentForm.key.trim().length > 0 && 
           this.isKeyValid() &&
           currentForm.channels.length > 0;
  });

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.submit.emit(this.form());
    }
  }

  onEnglishTextInput(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    this.form.set({ ...this.form(), english: input.value });
  }

  onGeorgianTextInput(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    this.form.set({ ...this.form(), georgian: input.value });
  }

  onKeyInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.form.set({ ...this.form(), key: input.value });
  }

  onLabelInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.labelInput.set(input.value);
  }

  onLabelKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addLabel();
    }
  }

  addLabel(): void {
    const label = this.labelInput().trim();
    if (label && !this.form().labels.includes(label)) {
      this.form.set({ 
        ...this.form(), 
        labels: [...this.form().labels, label] 
      });
      this.labelInput.set('');
    }
  }

  removeLabel(label: string): void {
    this.form.set({ 
      ...this.form(), 
      labels: this.form().labels.filter(l => l !== label) 
    });
  }

  toggleChannel(channel: string): void {
    const channels = this.form().channels;
    const isSelected = channels.includes(channel);
    
    if (isSelected) {
      this.form.set({ 
        ...this.form(), 
        channels: channels.filter(c => c !== channel) 
      });
    } else {
      this.form.set({ 
        ...this.form(), 
        channels: [...channels, channel] 
      });
    }
  }

  isChannelSelected(channel: string): boolean {
    return this.form().channels.includes(channel);
  }

  isKeyValid(): boolean {
    const key = this.form().key.trim();
    return /^[a-z0-9]+(\.[a-z0-9]+)*$/.test(key);
  }

  ngOnChanges(): void {
    if (this.isOpen()) {
      this.form.set({ ...this.formData() });
      this.labelInput.set('');
    }
  }
}