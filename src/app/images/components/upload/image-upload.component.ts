import { Component, ChangeDetectionStrategy, ViewChild, output } from '@angular/core';
import { ImageUploadDialogComponent } from '../upload-dialog/image-upload-dialog.component';
import { ImageItem } from '../card/image-card.component';

@Component({
  selector: 'ib-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ImageUploadDialogComponent]
})
export class ImageUploadComponent {
  @ViewChild(ImageUploadDialogComponent) uploadDialog!: ImageUploadDialogComponent;
  readonly fileSelected = output<ImageItem>();

  openUploadDialog() {
    this.uploadDialog.openDialog();
  }

  onImageUploaded(image: ImageItem) {
    this.fileSelected.emit(image);
  }

  onDialogClosed() {
    // Dialog closed, no action needed
  }
} 