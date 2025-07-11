import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ib-image-pagination',
  templateUrl: './image-pagination.component.html',
  styleUrl: './image-pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagePaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  
  @Output() previousPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();

  onPreviousPage() {
    this.previousPage.emit();
  }

  onNextPage() {
    this.nextPage.emit();
  }
} 