import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

export interface ImageItem {
  id: number;
  name: string;
  url: string;
  size: string;
  uploadedAt: string;
  device: string[];
  author: string;
  loaded?: boolean;
  error?: boolean;
}

@Component({
  selector: 'ib-image-card',
  templateUrl: './image-card.component.html',
  styleUrl: './image-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCardComponent {
  @Input() image!: ImageItem;
  @Output() imageLoad = new EventEmitter<ImageItem>();
  @Output() imageError = new EventEmitter<ImageItem>();
  @Output() imageSelect = new EventEmitter<ImageItem>();

  onImageLoad() {
    this.image.loaded = true;
    this.image.error = false;
    this.imageLoad.emit(this.image);
  }

  onImageError() {
    this.image.error = true;
    this.image.loaded = false;
    this.imageError.emit(this.image);
  }

  onImageSelect() {
    this.imageSelect.emit(this.image);
  }

  isBase64Image(url: string): boolean {
    return url.startsWith('data:image/');
  }

  formatDateTime(dateTimeString: string): string {
    // Handle both formats: YYYY-MM-DDTHH:mm and YYYY-MM-DD
    const date = new Date(dateTimeString.includes('T') ? dateTimeString + ':00' : dateTimeString + 'T00:00:00');
    
    if (isNaN(date.getTime())) {
      return dateTimeString; // Return original if parsing fails
    }
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleDateString('en-US', options);
  }
} 