import { Component, ChangeDetectionStrategy, signal, computed, output } from '@angular/core';
import { ImageItem } from '../card/image-card.component';

@Component({
  selector: 'ib-image-upload-dialog',
  templateUrl: './image-upload-dialog.component.html',
  styleUrl: './image-upload-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadDialogComponent {
  readonly imageUploaded = output<ImageItem>();
  readonly dialogClosed = output<void>();

  readonly currentUser = signal<string>('admin');
  readonly showDialog = signal(false);
  
  // Form signals
  readonly imageName = signal('');
  readonly selectedFile = signal<File | null>(null);
  readonly selectedDevice = signal<string>('');
  readonly previewUrl = signal<string>('');

  readonly isFormValid = computed(() => {
    return this.imageName().trim() && 
           this.selectedFile() && 
           this.selectedDevice().trim() !== '';
  });

  openDialog() {
    this.showDialog.set(true);
    this.resetForm();
  }

  closeDialog() {
    this.showDialog.set(false);
    this.resetForm();
    // TODO: The 'emit' function requires a mandatory void argument
    this.dialogClosed.emit();
  }

  private resetForm() {
    this.imageName.set('');
    this.selectedFile.set(null);
    this.selectedDevice.set('');
    this.previewUrl.set('');
  }

  onNameInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.imageName.set(target.value);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    const file = input.files[0];
    this.selectedFile.set(file);
    
    // Auto-fill name if empty
    if (!this.imageName().trim()) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      this.imageName.set(nameWithoutExt);
    }
    
    // Create preview and extract resolution
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  selectDevice(device: string) {
    this.selectedDevice.set(device);
  }

  isDeviceSelected(device: string): boolean {
    return this.selectedDevice() === device;
  }

  async uploadImage() {
    if (!this.isFormValid() || !this.selectedFile()) return;

    const file = this.selectedFile()!;
    const now = new Date();
    const uploadedAt = now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm format
    
    const resolution = await this.getImageResolution(this.previewUrl());
    
    const newImage: ImageItem = {
      id: Date.now(),
      name: this.imageName().trim(),
      url: this.previewUrl(),
      size: this.formatFileSize(file.size),
      resolution,
      uploadedAt,
      device: [this.selectedDevice()],
      author: this.currentUser()
    };

    this.imageUploaded.emit(newImage);
    this.closeDialog();
  }

  changeFile() {
    const fileInput = document.getElementById('image-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    } else if (bytes >= 1024) {
      return (bytes / 1024).toFixed(0) + ' KB';
    } else {
      return bytes + ' B';
    }
  }

  private getImageResolution(imageUrl: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(`${img.width} × ${img.height}`);
      };
      img.onerror = () => {
        resolve('Unknown');
      };
      img.src = imageUrl;
    });
  }
}
