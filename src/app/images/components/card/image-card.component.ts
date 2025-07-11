import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

export interface ImageItem {
  id: number;
  name: string;
  url: string;
  size: string;
  uploadedAt: string;
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
} 