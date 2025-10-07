import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface ImageItem {
  id: number;
  name: string;
  url: string;
  size: string;
  resolution: string;
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
  imports: [DatePipe],
  standalone: true
})
export class ImageCardComponent {
  readonly image = input.required<ImageItem>();
  readonly imageLoad = output<ImageItem>();
  readonly imageError = output<ImageItem>();
  readonly imageSelect = output<ImageItem>();
  readonly imageDelete = output<number>();

  onImageLoad() {
    const currentImage = { ...this.image(), loaded: true, error: false };
    this.imageLoad.emit(currentImage);
  }

  onImageError() {
    const currentImage = { ...this.image(), error: true, loaded: false };
    this.imageError.emit(currentImage);
  }

  onImageSelect() {
    this.imageSelect.emit(this.image());
  }

  onImageDelete(event: Event) {
    event.stopPropagation(); // Prevent card click when deleting
    this.imageDelete.emit(this.image().id);
  }

  isBase64Image(url: string): boolean {
    return url.startsWith('data:image/');
  }
} 