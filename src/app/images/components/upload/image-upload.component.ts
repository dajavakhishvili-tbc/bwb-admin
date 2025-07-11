import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

export interface UploadedImage {
  id: number;
  name: string;
  url: string;
  size: string;
  uploadedAt: string;
  loaded: boolean;
  error: boolean;
}

@Component({
  selector: 'ib-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadComponent {
  @Output() fileSelected = new EventEmitter<UploadedImage>();

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      const url = reader.result as string;
      const uploadedImage: UploadedImage = {
        id: Date.now(), // Simple ID generation
        name: file.name,
        url,
        size: this.formatFileSize(file.size),
        uploadedAt: new Date().toISOString().slice(0, 10),
        loaded: true,
        error: false
      };
      
      this.fileSelected.emit(uploadedImage);
    };
    
    reader.readAsDataURL(file);
    // Reset input value so same file can be uploaded again if needed
    input.value = '';
  }

  private formatFileSize(bytes: number): string {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    } else if (bytes >= 1024) {
      return (bytes / 1024).toFixed(0) + ' KB';
    } else {
      return bytes + ' B';
    }
  }
} 